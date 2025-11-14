🏥 Full-Stack Doctor Appointment Booking (MERN Stack)

A modern, scalable, and production-ready Doctor Appointment Booking System built using the MERN stack.
Patients can browse doctors, book appointments, update profiles, and manage bookings — while admins can manage doctors, appointments, and availability using a separate dashboard.

This project is fully deployed and uses cloud-based services such as MongoDB Atlas, Cloudinary, and Render.

🚀 Live Demo
<p align="center"> <a href="https://full-stack-doctor-appointment-booki.vercel.app" target="_blank"> <img src="https://img.shields.io/badge/User%20Website-Live-3b82f6?style=for-the-badge&logo=vercel&logoColor=white" /> </a> <a href="https://full-stack-doctor-appointment-booki-eight.vercel.app" target="_blank"> <img src="https://img.shields.io/badge/Admin%20Dashboard-Live-22c55e?style=for-the-badge&logo=vercel&logoColor=white" /> </a> <a href="https://your-render-backend-url.onrender.com" target="_blank"> <img src="https://img.shields.io/badge/Backend%20API-Live-a855f7?style=for-the-badge&logo=render&logoColor=white" /> </a> </p>
✨ Features
👤 User Features

User login & registration with JWT

Browse doctors by speciality

View doctor availability

Book appointment instantly

Secure payment flow (Stripe/Razorpay test mode)

User profile management

View appointment history

Fully responsive UI

🛠 Admin Features

Admin login with secure authentication

Add new doctors with full details (photo, speciality, fees)

Manage doctor availability

View all user appointments

Approve, cancel or complete appointments

Admin dashboard with analytics

🎨 Tech Stack
<div align="center"> <table> <tr> <th style="background:#1e293b;color:#fff;padding:10px;">🖥 MERN</th> <th style="background:#1e293b;color:#fff;padding:10px;">⚙ Backend</th> <th style="background:#1e293b;color:#fff;padding:10px;">🎨 Frontend</th> <th style="background:#1e293b;color:#fff;padding:10px;">🛠 Tools</th> <th style="background:#1e293b;color:#fff;padding:10px;">☁ Cloud</th> </tr> <tr align="center"> <td style="background:#3b82f6;color:white;padding:10px;">MongoDB</td> <td style="background:#f97316;color:white;padding:10px;">Node.js + Express</td> <td style="background:#14b8a6;color:white;padding:10px;">React + Vite + TailwindCSS</td> <td style="background:#6366f1;color:white;padding:10px;">JWT, Axios</td> <td style="background:#a855f7;color:white;padding:10px;">Cloudinary, Render, Vercel</td> </tr> </table> </div>
⚙️ Environment Variables
🔵 Backend .env
PORT=4000
MONGODB_URI=your_mongodb_uri

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret_key

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=yourpassword

JWT_SECRET=yourjwtsecret

FRONTEND_URL=https://full-stack-doctor-appointment-booki.vercel.app
ADMIN_URL=https://full-stack-doctor-appointment-booki-eight.vercel.app

🟣 Frontend .env
VITE_BACKEND_URL=https://your-backend.onrender.com

🔴 Admin .env
VITE_BACKEND_URL=https://your-backend.onrender.com

🧪 Run Locally
📌 Clone Repo
git clone https://github.com/your-username/your-repo.git

▶ Backend Setup
cd backend
npm install
npm run dev

▶ Frontend Setup
cd frontend
npm install
npm run dev

▶ Admin Dashboard Setup
cd admin
npm install
npm run dev

📦 Project Structure
├── backend/
├── frontend/
├── admin/
└── README.md

🧩 API Highlights

JWT-based authentication

Appointment booking

Doctor management

Payment verification

Role-based authorization

Cloudinary image uploads

MongoDB data models (Doctor, User, Appointment)

🛡 Security

Protected routes for admin & users

Password hashing using bcrypt

JWT authentication

CORS protection

Environment variable configuration

📌 Deployment

Frontend: Deployed on Vercel

Admin Panel: Deployed on Vercel

Backend API: Deployed on Render

Image Uploads: Managed via Cloudinary

Database: MongoDB Atlas (cloud hosted)
