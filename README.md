# StayFinder

A modern full-stack property rental platform built using **Node.js**, **Express.js**, **MongoDB**, **EJS**, and **Tailwind CSS**. The application enables users to discover, book, and manage rental properties through a clean, responsive interface with secure authentication, Razorpay payment integration, Cloudinary image uploads, and persistent database storage.

---

## Live Demo

https://stayfinder-m131.onrender.com

---

## Overview

StayFinder is a full-stack property rental platform inspired by Airbnb. Users can browse properties, view detailed listings, save favourite homes, securely book stays with Razorpay payment integration, and manage their bookings. Hosts can add, edit, and manage property listings, view bookings for their properties, and manage reservations with Cloudinary image uploads. Built using the MVC architecture, the application delivers a scalable, secure, and responsive experience across desktop and mobile devices.

---

## Features

### User Features

- Browse available properties
- View detailed property information
- Save and remove favourite properties
- Check booking availability
- Securely book rental properties
- Razorpay payment gateway integration
- Secure user authentication
- Responsive and mobile-friendly interface

### Host Features

- Add new properties
- Edit property details
- Delete listed properties
- Manage hosted properties
- View and manage property bookings
- Track booking status

### General Features

- Session-based authentication
- Booking availability validation
- Razorpay payment verification
- Cloudinary image upload integration
- MongoDB database integration
- Responsive UI with Tailwind CSS
- MVC architecture
- Persistent database storage

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
- Razorpay
- Render

---

## Project Structure

```text
StayFinder/
│
├── config/
│   ├── cloudinary.js
│   ├── db.js
│   └── razorpay.js
│
├── controllers/
│   ├── authController.js
│   ├── bookingController.js
│   ├── favouriteController.js
│   ├── hostController.js
│   ├── paymentController.js
│   └── storeController.js
│
│
├── models/
│   ├── booking.js
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
│   ├── bookingRouter.js
│   ├── favouriteRouter.js
│   ├── hostRouter.js
│   ├── paymentRouter.js
│   └── storeRouter.js
│
├── utils/
│
├── views/
│   ├── auth/
│   ├── bookings/
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

## Home Page

<img width="1901" height="907" alt="image" src="https://github.com/user-attachments/assets/da1b060f-323c-476f-8cd3-bfcebb10f0ce" />

## Property Details

<img width="977" height="797" alt="image" src="https://github.com/user-attachments/assets/09ca6920-920a-404c-8b72-b5c6ae7fd05a" />

## Booking & Razorpay Payment

<img width="1917" height="913" alt="Screenshot 2026-07-20 195220" src="https://github.com/user-attachments/assets/f36e0065-b296-4e37-94b2-c79257b8519e" />

## Host Dashboard

<img width="1898" height="911" alt="Screenshot 2026-07-20 195518" src="https://github.com/user-attachments/assets/02c54ae9-e96a-4ffb-abfe-62489f3908b3" />

## My Bookings

<img width="1901" height="911" alt="Screenshot 2026-07-20 195428" src="https://github.com/user-attachments/assets/ba9c3f1f-5796-49ab-be97-24d26c2e2fa5" />

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

RAZORPAY_KEY_ID=your_razorpay_key_id

RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

### Start the Application

```bash
npm start
```

Open your browser

```
http://localhost:3001
```

---

## Usage

- Browse available rental properties
- View complete property details
- Add or remove favourite homes
- Check property availability
- Securely book properties with Razorpay
- Register and login securely
- Hosts can add, edit, and delete properties
- Upload property images using Cloudinary
- Access the application on desktop, tablet, and mobile devices

---

## Deployment

### Application

- Render

### Database

- MongoDB Atlas

### Image Storage

- Cloudinary

---

## Future Enhancements

- Property Search & Advanced Filters
- User Profile Dashboard
- Reviews & Ratings
- Google Maps Integration
- Email Notifications
- Dark Mode
- Progressive Web App (PWA)
- Docker Support
- Unit & Integration Testing