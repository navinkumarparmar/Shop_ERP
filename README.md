# Shop ERP

**Shop ERP** is a full-stack web application for managing shops and products. Users can register, login, create shops, manage products within shops, and view a dashboard summarizing total shops and products. The app is built with **React** on the frontend and **Node.js + Express + MongoDB** on the backend.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Installation](#installation)  
- [Folder Structure](#folder-structure)  
- [Environment Variables](#environment-variables)  
- [Running the Project](#running-the-project)  
- [API Endpoints](#api-endpoints)  
- [Frontend Pages](#frontend-pages)  
- [License](#license)  

---

## Features

- User Authentication (Register / Login / Logout)  
- Add, Edit, Delete Shops  
- Add, Edit, Delete Products in each shop  
- Dashboard showing total shops and total products  
- Product prices displayed in INR  
- Responsive UI with React  
- Error handling and toast notifications  

---

## Tech Stack

**Frontend:**  
- React  
- React Router  
- Axios  

**Backend:**  
- Node.js  
- Express  
- MongoDB (Mongoose)  
- dotenv  
- body-parser  
- CORS  

**Deployment:**  
- Render.com (Backend & Frontend)  

---

## Installation

### Clone the repository

```bash
git clone https://github.com/navinkumarparmar/Shop_ERP.git

### Backend Setup

cd backend
npm install
npm run start

### Frontend Setup

cd frontend
npm install
npm start 
# npm run build


### ENV 
PORT=
MONGO_URI=""
JWT_SECRET=""
NODE_ENV= development || production

###

### Auth Routes
| Method | Endpoint           | Description             | Auth Required |
| ------ | ------------------ | ----------------------- | ------------- |
| POST   | /api/auth/register | Register new user       | No            |
| POST   | /api/auth/login    | Login user              | No            |
| GET    | /api/auth/getOne   | Get logged-in user info | Yes           |




###Shops Routes
| Method | Endpoint           | Description                 | Auth Required |
| ------ | ------------------ | --------------------------- | ------------- |
| POST   | /api/shops         | Create new shop             | Yes           |
| PUT    | /api/shops/\:id    | Update shop                 | Yes           |
| GET    | /api/shops/all     | Get all shops with products | Yes           |
| GET    | /api/shops/myshops | Get current user's shops    | Yes           |



###Products Routes

| Method | Endpoint                    | Description             | Auth Required |
| ------ | --------------------------- | ----------------------- | ------------- |
| POST   | /api/products/\:shopId      | Add product to shop     | Yes           |
| PUT    | /api/products/\:id          | Update product          | Yes           |
| GET    | /api/products/shop/\:shopId | Get products for a shop | Yes           |
| DELETE | /api/products/\:id          | Delete product          | Yes           |


