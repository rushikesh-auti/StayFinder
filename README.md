# StayFinder

A modern full-stack property rental platform built using **Node.js**, **Express.js**, **MongoDB**, **EJS**, and **Tailwind CSS**. The application enables users to discover, book, and manage rental properties through a clean, responsive interface with secure authentication, Cloudinary image uploads, and persistent database storage.

---

## Live Demo

https://your-live-demo-link.com

---

## Overview

StayFinder is a full-stack property rental application inspired by Airbnb. It allows users to browse properties, view detailed listings, save favourite homes, book stays, and enables hosts to manage their property listings. The application follows the MVC architecture, ensuring scalability, maintainability, and a seamless experience across desktop and mobile devices.

---

## Features

### User Features

- Browse available properties
- View detailed property information
- Save and remove favourite properties
- Book rental properties
- Secure user authentication
- Responsive and mobile-friendly interface

### Host Features

- Add new properties
- Edit property details
- Delete listed properties
- Manage hosted properties

### General Features

- Session-based authentication
- Cloudinary image upload integration
- MongoDB database integration
- Responsive UI with Tailwind CSS
- MVC architecture
- Persistent data storage

---

## Technologies Used

### Frontend

- EJS
- JavaScript (ES6+)
- Tailwind CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Development Tools

- Git
- GitHub
- VS Code
- MongoDB Atlas
- Cloudinary

---

## Project Structure

```text
StayFinder/
│
├── controllers/
│   ├── authController.js
│   ├── favouriteController.js
│   ├── hostController.js
│   └── storeController.js
│
├── middleware/
│
├── models/
│   ├── favourite.js
│   ├── home.js
│   └── user.js
│
├── public/
│   ├── css/
│   ├── images/
│   └── output.css
│
├── routes/
│   ├── authRouter.js
│   ├── favouriteRouter.js
│   ├── hostRouter.js
│   └── storeRouter.js
│
├── utils/
│
├── views/
│   ├── auth/
│   ├── favourites/
│   ├── host/
│   ├── homes/
│   ├── partials/
│   └── 404.ejs
│
├── app.js
├── package.json
└── README.md
```

---

## Preview

> Add screenshots of your application here.

---

## Getting Started

### Prerequisites

Before running this project, ensure you have installed:

- Node.js (v18 or above)
- npm
- MongoDB Atlas account
- Cloudinary account

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/rushikesh-auti/StayFinder.git
```

Navigate to the project folder

```bash
cd StayFinder
```

Install dependencies

```bash
npm install
```

---

### Configure Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

SESSION_SECRET=your_session_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

### Start the Application

```bash
npm start
```

Open your browser

```
http://localhost:3000
```

---

## Usage

- Browse available rental properties
- View complete property details
- Add or remove favourite homes
- Book rental properties
- Register and login securely
- Hosts can add, edit, and delete properties
- Upload property images using Cloudinary
- Access the application on desktop, tablet, and mobile devices

---

## Deployment

### Database

- MongoDB Atlas

### Image Storage

- Cloudinary

---

## Future Enhancements

- Online Payment Integration
- Property Search & Advanced Filters
- User Profile Dashboard
- Host Dashboard Analytics
- Reviews & Ratings
- Google Maps Integration
- Email Notifications
- Booking History
- Property Availability Calendar
- Dark Mode
- Progressive Web App (PWA)
- Docker Support
- Unit & Integration Testing