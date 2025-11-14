# 🏥 Full-Stack Doctor Appointment Booking System (MERN Stack)

A modern, scalable, and production-ready platform for seamlessly connecting patients and doctors. This application provides a rich, responsive experience for users to manage appointments and a separate, secure dashboard for administrators to oversee the entire operation.

This project is built using the **MERN** stack and fully deployed using leading cloud services, demonstrating a complete, professional development workflow.

---

## 🚀 Live Demos

Explore the application and the separate admin panel:

| Component | Status | URL |
| :--- | :--- | :--- |
| **User Website (Patient Portal)** | [![User Website - Live](https://img.shields.io/badge/User%20Website-Live-3b82f6?style=for-the-badge&logo=vercel&logoColor=white)](https://full-stack-doctor-appointment-booki.vercel.app) | `https://full-stack-doctor-appointment-booki.vercel.app` |
| **Admin Dashboard** | [![Admin Dashboard - Live](https://img.shields.io/badge/Admin%20Dashboard-Live-22c55e?style=for-the-badge&logo=vercel&logoColor=white)](https://full-stack-doctor-appointment-booki-eight.vercel.app) | `https://full-stack-doctor-appointment-booki-eight.vercel.app` |
| **Backend API** | [![Backend API - Live](https://img.shields.io/badge/Backend%20API-Live-a855f7?style=for-the-badge&logo=render&logoColor=white)](https://your-render-backend-url.onrender.com) | `https://your-render-backend-url.onrender.com` |

---

## ✨ Features

### 👤 User (Patient) Features

* **Secure Authentication:** User login & registration secured with **JWT**.
* **Doctor Directory:** Browse and filter doctors by **speciality**.
* **Availability View:** View real-time doctor availability slots.
* **Instant Booking:** Book appointments directly within the platform.
* **Payment Gateway:** Secure payment flow integration using **Stripe** and **Razorpay** (test mode).
* **Profile Management:** Update personal information and profile details.
* **Booking History:** View and manage a comprehensive history of appointments.
* **Responsive UI:** Fully responsive design using **TailwindCSS** for all devices.

### 🛠 Admin (Management) Features

* **Secure Access:** Admin login with dedicated, secure authentication.
* **Doctor Management:** CRUD operations for adding, updating, and removing doctors (including photo upload via **Cloudinary**).
* **Availability Control:** Manage doctor working hours and available slots.
* **Appointment Oversight:** View all user appointments across the system.
* **Workflow Control:** Approve, cancel, or mark appointments as complete.
* **Analytics Dashboard:** Overview dashboard providing key metrics and analytics.

---

## 🎨 Tech Stack

The project leverages a robust and modern stack for a high-performance, maintainable application.

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Database** | **MongoDB** | Flexible, cloud-hosted NoSQL database via MongoDB Atlas. |
| **Backend** | **Node.js + Express** | High-speed, scalable server environment and API routing. |
| **Frontend** | **React + Vite** | Modern, fast, and component-based user interfaces. |
| **Styling** | **TailwindCSS** | Utility-first CSS framework for rapid, responsive UI development. |
| **Security** | **JWT, bcrypt** | Token-based authentication and secure password hashing. |
| **API/Data** | **Axios** | Promise-based HTTP client for API interaction. |
| **Cloud/Deployment**| **Vercel, Render** | Hosting the frontends and the backend API respectively. |
| **Media** | **Cloudinary** | Cloud-based solution for secure image storage and delivery. |

---

## ⚙️ Environment Variables

To run this project locally, you need to configure environment variables for the Backend, Frontend, and Admin Panel.

### 🔵 Backend (`.env`)

| Variable | Description |
| :--- | :--- |
| `PORT` | Server port (e.g., `4000`) |
| `MONGODB_URI` | Connection string for MongoDB Atlas. |
| `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY` | Credentials for image handling. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Default credentials for initial admin access. |
| `JWT_SECRET` | Secure string for signing JWTs. |
| `FRONTEND_URL`, `ADMIN_URL` | CORS configuration and redirection URLs. |

### 🟣 Frontend (`frontend/.env`) & 🔴 Admin (`admin/.env`)

| Variable | Description |
| :--- | :--- |
| `VITE_BACKEND_URL` | The URL where your Node/Express backend is deployed or running locally (e.g., `http://localhost:4000`). |

---

## 🧪 Run Locally

Follow these steps to set up and run the project components on your local machine.

### 📌 1. Clone the Repository

```bash
git clone [https://github.com/your-username/your-repo.git](https://github.com/your-username/your-repo.git)
cd your-repo
