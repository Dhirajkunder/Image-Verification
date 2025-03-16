import sys
import json
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
import cv2
import io
import os
import warnings
from typing import Dict

# Suppress deprecation warnings
warnings.filterwarnings("ignore", category=UserWarning)


class ChannelAttention(nn.Module):
    def __init__(self, in_channels, reduction_ratio=16):
        super(ChannelAttention, self).__init__()
        self.avg_pool = nn.AdaptiveAvgPool2d(1)
        self.max_pool = nn.AdaptiveMaxPool2d(1)
        self.fc1 = nn.Conv2d(in_channels, in_channels // reduction_ratio, kernel_size=1)
        self.relu = nn.ReLU()
        self.fc2 = nn.Conv2d(in_channels // reduction_ratio, in_channels, kernel_size=1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        avg_pool = self.avg_pool(x)
        max_pool = self.max_pool(x)
        avg_out = self.fc2(self.relu(self.fc1(avg_pool)))
        max_out = self.fc2(self.relu(self.fc1(max_pool)))
        return x * self.sigmoid(avg_out + max_out)


class SpatialAttention(nn.Module):
    def __init__(self, kernel_size=7):
        super(SpatialAttention, self).__init__()
        self.conv = nn.Conv2d(2, 1, kernel_size=kernel_size, padding=(kernel_size - 1) // 2)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        avg_pool = torch.mean(x, dim=1, keepdim=True)
        max_pool, _ = torch.max(x, dim=1, keepdim=True)
        pool = torch.cat([avg_pool, max_pool], dim=1)
        return x * self.sigmoid(self.conv(pool))


class CBAM(nn.Module):
    def __init__(self, in_channels, reduction_ratio=16, spatial_kernel_size=7):
        super(CBAM, self).__init__()
        self.channel_attention = ChannelAttention(in_channels, reduction_ratio)
        self.spatial_attention = SpatialAttention(spatial_kernel_size)

    def forward(self, x):
        x = self.channel_attention(x)
        x = self.spatial_attention(x)
        return x


class SiameseResNet(nn.Module):
    def __init__(self):
        super(SiameseResNet, self).__init__()
        # Using weights parameter instead of pretrained
        self.baseModel = models.resnet50(weights=None)
        self.attention1 = CBAM(in_channels=256)
        self.attention2 = CBAM(in_channels=1024)
        self.baseModel.conv1 = nn.Conv2d(1, 64, kernel_size=7, stride=2, padding=3, bias=False)
        self.baseModel.fc = nn.Identity()

    def forward(self, x):
        x = self.baseModel.conv1(x)
        x = self.baseModel.bn1(x)
        x = self.baseModel.relu(x)
        x = self.baseModel.maxpool(x)

        x = self.attention1(self.baseModel.layer1(x))
        x = self.baseModel.layer2(x)
        x = self.attention2(self.baseModel.layer3(x))
        x = self.baseModel.layer4(x)

        x = F.adaptive_avg_pool2d(x, (1, 1))
        x = torch.flatten(x, 1)
        return x


class LogisticSiameseRegression(nn.Module):
    def __init__(self, model):
        super(LogisticSiameseRegression, self).__init__()
        self.model = model
        self.fc = nn.Sequential(
            nn.Linear(2048, 1024),
            nn.LeakyReLU(inplace=True),
            nn.Dropout(0.2),
            nn.Linear(1024, 256),
            nn.LeakyReLU(inplace=True),
            nn.Linear(256, 1),
            nn.LeakyReLU(inplace=True)
        )
        self.sigmoid = nn.Sigmoid()

    def forward_once(self, x):
        x = self.model(x)
        return F.normalize(x, p=2, dim=1)

    def forward(self, x1, x2):
        out1 = self.forward_once(x1)
        out2 = self.forward_once(x2)
        diff = out1 - out2
        out = self.fc(diff)
        return self.sigmoid(out)


def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("L")
    img = np.array(image)

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 2))
    morphology_img = cv2.morphologyEx(img, cv2.MORPH_CLOSE, kernel, iterations=1)
    blur = cv2.GaussianBlur(morphology_img, (3, 3), 0)
    _, binary = cv2.threshold(blur, 127, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    coords = cv2.findNonZero(binary)
    x, y, w, h = cv2.boundingRect(coords)

    padding = 5
    x, y = max(0, x - padding), max(0, y - padding)
    w = min(w + 2 * padding, img.shape[1] - x)
    h = min(h + 2 * padding, img.shape[0] - y)

    cropped = binary[y:y + h, x:x + w]
    extra_space = np.zeros((cropped.shape[0] + 2 * padding, cropped.shape[1] + 2 * padding), dtype=np.uint8)
    extra_space[padding:-padding, padding:-padding] = cropped
    corrected = cv2.resize(extra_space, (330, 175))

    return Image.fromarray(corrected)


def verify_signature(genuine_path: str, test_path: str, model_path: str) -> Dict:
    # Check if files exist
    if not os.path.exists(genuine_path):
        raise FileNotFoundError(f"Genuine signature file not found: {genuine_path}")
    if not os.path.exists(test_path):
        raise FileNotFoundError(f"Test signature file not found: {test_path}")
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Load model
    siamese_model = SiameseResNet()
    siamese_model = nn.DataParallel(siamese_model).to(device)
    logimodel = LogisticSiameseRegression(siamese_model).to(device)

    # Load model with weights_only=True for security
    logimodel.load_state_dict(
        torch.load(model_path, map_location=device, weights_only=True)
    )
    logimodel.eval()

    # Read and preprocess images
    with open(genuine_path, 'rb') as f:
        genuine_bytes = f.read()
    with open(test_path, 'rb') as f:
        test_bytes = f.read()

    genuine_img = preprocess_image(genuine_bytes)
    test_img = preprocess_image(test_bytes)

    transform = transforms.Compose([
        transforms.Resize((175, 330)),
        transforms.ToTensor(),
    ])

    input1 = transform(genuine_img).unsqueeze(0).to(device)
    input2 = transform(test_img).unsqueeze(0).to(device)

    with torch.no_grad():
        prediction = logimodel(input1, input2)
        pred1 = logimodel.forward_once(input1)
        pred2 = logimodel.forward_once(input2)
        diff = torch.pairwise_distance(pred1, pred2)
        similarity_score = 1 / (1 + diff)

        return {
            "similarity_score": float(similarity_score),
            "probability": float(prediction),
            "is_genuine": bool(similarity_score > 0.8),
            "confidence": "high" if abs(float(similarity_score) - 0.8) > 0.1 else "low"
        }


def main():
    # Read input from stdin
    for line in sys.stdin:
        try:
            data = json.loads(line)
            genuine_path = data.get('genuine_path')
            test_path = data.get('test_path')
            model_path = data.get('model_path', 'logistic_model_triangular_m09_ashoj3.pth')

            if not genuine_path or not test_path:
                result = {
                    "error": "Missing required paths",
                    "status": "error"
                }
            else:
                result = verify_signature(genuine_path, test_path, model_path)
                result["status"] = "success"

            # Send result back to Node.js
            print(json.dumps(result))
            sys.stdout.flush()

        except json.JSONDecodeError:
            print(json.dumps({"error": "Invalid JSON input", "status": "error"}))
            sys.stdout.flush()
        except Exception as e:
            print(json.dumps({"error": str(e), "status": "error"}))
            sys.stdout.flush()


if __name__ == "__main__":
    main()