# Chatterbox - Real-Time Chat Application

---

## Project Overview

Chatterbox is a real-time chat application built using the **MERN stack** (MongoDB, Express.js, React, Node.js) and **Socket.IO** for live, bidirectional communication between clients and server.  
Users can register, log in, see who's online, send real-time messages, and see typing indicators.

---

## Features Implemented

- User registration and authentication (with JWT tokens)
- Secure password hashing using bcrypt
- Real-time chat with Socket.IO
- Typing indicators showing when users are typing
- Online users list updating live
- Responsive and clean React frontend with React Router
- Backend REST API for auth and user management
- Cross-Origin Resource Sharing (CORS) properly configured

---

## Screenshots / GIFs

### Registration Page

![Registration](./screenshots/register.png)

### Login Page

![Login](./screenshots/login.png)

### Chat Interface

![Chat](./screenshots/chat.png)

*(Add GIFs here if you prefer animated demos)*

---

## Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- npm or pnpm package manager
- MongoDB Atlas or local MongoDB instance

---

### Clone the repository

```bash
git clone https://github.com/YourUsername/Chatterbox-App.git
cd Chatterbox-App

Setup the Server
Navigate to the server folder:
cd server

Install dependencies:
pnpm install
# or npm install

Create a .env file in server/ with the following variables:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

Start the server:
pnpm run dev
# or npm run dev
The backend server will run on http://localhost:5000.

Setup the Client
Navigate to the client folder:
cd ../client
Install dependencies:
pnpm install
# or npm install

Create a .env file in client/ with the following variable:
VITE_API_URL=http://localhost:5000/api

Start the client:
pnpm run dev
# or npm run dev
The frontend will be available at http://localhost:5173.

Deployment
Backend Deployment
The backend server is deployed on Render at:

https://chatterbox-server-0zpy.onrender.com

Frontend Deployment
The frontend client is deployed on Vercel at:

https://chatterbox-chat-app.vercel.app/

Notes
Make sure to update the environment variables in both server and client when deploying.

The frontend client communicates with the backend server via the deployed backend URL specified in VITE_API_URL.

CORS settings are configured to allow requests from the frontend URL.

License
MIT License

Contact
Created by Khalipa Baba- feel free to reach out for questions or collaborations.



