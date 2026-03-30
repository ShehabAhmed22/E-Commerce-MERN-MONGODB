# 🛒 E-Commerce Store

[![Backend](https://img.shields.io/badge/Backend-Node.js-green)](https://nodejs.org/)  
[![Frontend](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/)  
[![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen)](https://www.mongodb.com/)  
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

A **full-featured E-commerce platform** built with **Express.js + MongoDB** (backend) and **React.js + Vite** (frontend) 🌐🚀  

_Built with ❤️ by [Shehab Elbana]_

---

## 🔗 Demo
[![Watch the Demo](https://img.shields.io/badge/Watch%20Demo-LinkedIn-blue?logo=linkedin)](#)

![Project Preview](https://user-images.githubusercontent.com/your-username/demo-preview.gif)  
*Screenshot/GIF showing your app in action*

---

## ✨ Features Overview

### 🔐 Authentication & Users
- 👤 User registration & login (JWT Authentication)  
- 🔐 Logout & refresh tokens  
- 📄 Get current user profile (`/me`)  

### 🛍️ Products & Categories
- 📦 Create, update, delete products (admin only)  
- 📄 Get all products or single product  
- 📂 Create, update, delete categories (admin only)  
- 📄 Get all categories or single category  

### 🛒 Shopping Cart
- ➕ Add products to cart  
- 📄 View cart items  
- ✏️ Update quantity of cart items  
- ❌ Remove items from cart  
- 🗑️ Clear entire cart  

### 🧾 Orders
- 🛒 Create order  
- 📄 Get my orders  
- ✏️ Update or cancel orders  
- 📄 Admin: Get all orders  
- 📊 Admin: Get order stats  

### 💳 Payments
- Stripe integration for secure payments  

### 🔔 Notifications & Admin
- Admin-only routes are protected with JWT + role-based authorization (`admin`)  
- Secure routes with `authenticate` middleware  

---

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js  
- MongoDB + Mongoose ORM  
- JWT Authentication  
- Bcryptjs → password hashing  
- Cloudinary → image uploads  
- Stripe → payment integration  
- Helmet + CORS → security  

### Frontend
- React.js + Vite  
- React Hook Form + Zod → validation  
- Axios → API calls  
- Lucide React → icons  
- Sonner → toast notifications  
- Zustand → state management  
- SCSS → responsive styling  
---

## 🎨 Badges
[![React](https://img.shields.io/badge/React-19.2.4-blue)](https://reactjs.org/)  
[![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green)](https://nodejs.org/)  
[![Express](https://img.shields.io/badge/Express-5.2.1-lightgrey)](https://expressjs.com/)  
[![MongoDB](https://img.shields.io/badge/MongoDB-9.3.0-brightgreen)](https://www.mongodb.com/)  
[![Stripe](https://img.shields.io/badge/Stripe-20.4.1-purple)](https://stripe.com/)  
