Signature Verification System

Overview

SignifySecure is a web-based application designed for verifying digital signatures using a deep learning-based Siamese network model. The system allows users to upload a genuine signature and a test signature to determine authenticity.

Features

User Authentication: Login & Register functionality with session handling.

Role-Based Access: Admin can view a list of users; normal users can only verify signatures.

Signature Verification: Uses a deep learning model to compare signatures.

Real-Time Feedback: Displays probability score and confidence level.

Tech Stack

Frontend: React.js (Vite), Tailwind CSS, Framer Motion

Backend: Node.js, Express.js

Database: MongoDB

Machine Learning: Python (PyTorch, OpenCV, PIL, NumPy, torchvision)

Setup Instructions

Prerequisites

Node.js & npm installed

Python (3.x) installed

MongoDB running locally or on a cloud service

Installation

Setting Up a New Vite React Project

Create a new Vite React project:

npm create vite@latest client --template react
cd client
npm install

Install frontend dependencies:

npm install tailwindcss framer-motion axios react-router-dom


Backend Installation

Move to the server directory:

cd ../server

Install backend dependencies:

npm install express mongoose dotenv cors body-parser jsonwebtoken bcryptjs

Environment Variables

Create a .env file in the server directory with:

MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>

Running the Application

Start the frontend:

cd client && npm run dev

Start the backend:

cd ../server && npm start or node server.js 

Python Signature Verification Script

The verify_signature.py script is used to verify digital signatures using a Siamese neural network with CBAM (Convolutional Block Attention Module).

Dependencies

Install required Python libraries:

pip install torch torchvision numpy opencv-python pillow

How It Works

Preprocesses the input images (grayscale conversion, noise reduction, cropping, resizing).

Passes the images through a Siamese ResNet model with CBAM.

Computes feature similarity and outputs a probability score.

Running the Script

python verify_signature.py 

JSON Input Format

The script can also receive JSON input via stdin:

{
  "genuine_path": "path/to/genuine.png",
  "test_path": "path/to/test.png",
  "model_path": "logistic_model.pth"
}

JSON Output Format

{
  "similarity_score": 0.95,
  "probability": 0.92,
  "is_genuine": true,
  "confidence": "high",
  "status": "success"
}

Git Ignore File

Ensure you have a .gitignore file to exclude unnecessary files:


Contributing

Fork the repository

Create a new branch (git checkout -b feature-name)

Commit changes (git commit -m "Added new feature")

Push to GitHub (git push origin feature-name)



Contributors

👤 Dhiraj Kunder
