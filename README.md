# SignifySecure - Signature Verification System

A full-stack Signature Verification System using MERN (MongoDB, Express.js, React.js, Node.js) architecture, Vite for frontend setup, and a Deep Learning-based Siamese Network model in Python for signature verification. This project enables users to authenticate and verify digital signatures securely with real-time feedback.

---

## 📅 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Machine Learning Integration](#machine-learning-integration)
- [Known Issues](#known-issues)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [License](#license)

---

## 📄 Overview

**SignifySecure** is a professional web application designed for verifying digital signatures. It leverages a Deep Learning model (Siamese network with CBAM) to compare and authenticate signature images.

**Key functionalities include:**
- User Authentication with role-based access control (Admin/User)
- Image Upload and Signature Verification using ML model
- Real-time feedback with similarity score and confidence level

---

## ✨ Features
- **User Authentication:** Secure login and registration with hashed passwords
- **Role-Based Access:**
  - **Admin:** View list of registered users
  - **User:** Access only signature verification functionality
- **Signature Verification:** Compare uploaded signatures via a deep learning model
- **Real-Time Feedback:** Display similarity probability and confidence classification
- **Session Management:** JWT-based authentication with LocalStorage support

---

## 🚀 Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- Framer Motion
- Axios
- React Router DOM

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- Multer (file uploads)
- Bcrypt.js (password encryption)
- JSON Web Token (JWT)
- Body-parser, CORS, Dotenv

**Machine Learning (Python):**
- PyTorch
- OpenCV
- Pillow (PIL)
- NumPy
- Torchvision

---

## ⚙️ Getting Started

### Prerequisites
- Node.js and npm installed
- Python 3.x installed
- MongoDB running locally or hosted (MongoDB Atlas)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Dhirajkunder/Image-Verification.git
cd Image-Verification
```

2. **Backend Setup:**
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

3. **Frontend Setup:**
```bash
cd backend
npm install
npm run dev
```

4. **Machine Learning Setup:**
pip install torch torchvision numpy opencv-python pillow
```

5. **Running Python Script for Signature Verification:**
```bash
python verify_signature.py
```

---

## 📈 Environment Variables

In the `server/` directory, create a `.env` file with:
```plaintext
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 🔗 API Endpoints

### Auth Routes
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Authenticate and receive JWT

### Upload Routes
- `POST /api/upload` — Upload genuine and test signatures (protected route)

---

## 🤖 Machine Learning Integration

**`verify_signature.py`** performs signature verification with these steps:
- **Preprocessing:** Grayscale conversion, denoising, cropping, resizing
- **Model Inference:** Siamese ResNet model with CBAM attention
- **Prediction:** Calculates similarity score and probability

### Running the Script
```bash
python verify_signature.py
```

### JSON Input Format
```json
{
  "genuine_path": "path/to/genuine.png",
  "test_path": "path/to/test.png",
  "model_path": "logistic_model.pth"
}
```

### JSON Output Format
```json
{
  "similarity_score": 0.95,
  "probability": 0.92,
  "is_genuine": true,
  "confidence": "high",
  "status": "success"
}
```

---


## 🤝 Contributing

We welcome contributions! Here's how you can contribute:
1. Fork the repository
2. Create your feature branch:
```bash
git checkout -b feature-name
```
3. Commit your changes:
```bash
git commit -m "Added new feature"
```
4. Push to your branch:
```bash
git push origin feature-name
```
5. Open a Pull Request

---

## 👥 Contributors

- 👤 [Dhiraj Kunder](https://github.com/Dhirajkunder)

---

## 🌐 License

This project is licensed under the [MIT License](LICENSE).

---

> Made with ❤️ by [Dhirajkunder](https://github.com/Dhirajkunder)

