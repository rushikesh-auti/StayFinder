# StayFinder

A modern full-stack property rental platform built using Node.js, Express.js, MongoDB, EJS, and Tailwind CSS. StayFinder enables users to discover, book, review, and manage rental properties through a secure, responsive, and user-friendly interface with Razorpay payment integration, Cloudinary image uploads, and persistent database storage.

---

## Live Demo

https://stayfinder-m131.onrender.com

---

## Overview

StayFinder is a full-stack property rental platform inspired by Airbnb. Guests can browse properties, save favourites, book stays securely, manage bookings, write reviews, and maintain a personal profile. Hosts can add, edit, and manage property listings, view bookings for their properties, and manage reservations. The application follows the MVC architecture, ensuring a scalable, maintainable, and production-ready codebase.

---

## Features

### User Features

- Secure user registration and login
- Browse available properties
- View detailed property information
- Save and remove favourite properties
- Check booking availability
- Securely book rental properties
- Razorpay payment gateway integration
- View and manage personal bookings
- Secure user authentication
- Responsive and mobile-friendly interface
- User can write reviews and ratings

### Host Features

- Add new properties
- Edit property details
- Delete listed properties
- Manage hosted properties
- View and manage property bookings
- Track booking status

### Core Features

- Session-based authentication
- Role-based access control (Guest / Host)
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

### Services & Tools

- Git
- GitHub
- VS Code
- MongoDB Atlas
- Cloudinary
- Razorpay
- Render

---

## Project Structure

```
StayFinder/
│
├── config/
│   ├── cloudinary.js
│   └── razorpay.js
│
├── controllers/
│   ├── authController.js
│   ├── bookingController.js
│   ├── errors.js
│   ├── hostController.js
│   ├── paymentController.js
│   ├── reviewController.js
│   ├── staticController.js
│   └── storeController.js
│
├── models/
│   ├── booking.js
│   ├── home.js
│   ├── review.js
│   └── user.js
│
├── public/
│   ├── home.css
│   ├── input.css
│   ├── output.css
│   └── images/
│
├── routes/
│   ├── authRouter.js
│   ├── bookingRouter.js
│   ├── hostRouter.js
│   ├── paymentRouter.js
│   ├── reviewRouter.js
│   ├── staticRouter.js
│   └── storeRouter.js
│
├── utils/
│   ├── emailService.js
│   ├── pathUtil.js
│   └── sendEmail.js
│
├── views/
│   ├── auth/
│   ├── host/
│   ├── pages/
│   ├── partials/
│   ├── store/
│   └── 404.ejs
│
├── app.js
├── nodemon.json
├── package.json
├── tailwind.config.js
└── README.md
```

---

## Preview

## Home Page

<img width="1917" height="907" alt="image" src="https://github.com/user-attachments/assets/25de35b8-331a-491d-a697-76fefbe0357a" />

## Property Details

<img width="992" height="802" alt="image" src="https://github.com/user-attachments/assets/78646fe0-f88b-4392-bd5a-46eb139261e0" />

## Booking & Razorpay Payment

<img width="1917" height="913" alt="Screenshot 2026-07-20 195220" src="https://github.com/user-attachments/assets/f36e0065-b296-4e37-94b2-c79257b8519e" />

## My Bookings

<img width="1908" height="906" alt="Screenshot 2026-08-09 111001" src="https://github.com/user-attachments/assets/093a8a7d-408a-4b23-a356-eb59adada2d2" />

## User Profile

<img width="987" height="752" alt="Screenshot 2026-08-09 113244" src="https://github.com/user-attachments/assets/b6fcbcfa-249d-4f01-ae58-892a3a909b6d" />

## Reviews & Ratings

<img width="1912" height="913" alt="Screenshot 2026-08-09 113428" src="https://github.com/user-attachments/assets/35807084-7daf-4492-b0a2-38a1c6846e19" />

## Host Dashboard

<img width="1917" height="912" alt="Screenshot 2026-08-09 113025" src="https://github.com/user-attachments/assets/fab9335f-c7c0-4419-baf8-e4f75999896c" />

## Dark Mode Interface

<img width="1902" height="897" alt="image" src="https://github.com/user-attachments/assets/61a28962-35dd-48d6-a8f0-c0d27c1c76ca" />

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
PORT=3001

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

### Guests

- Register or log in securely.
- Browse and search available rental properties.
- View complete property details, pricing, and amenities.
- Add or remove properties from favourites.
- Check availability and book properties.
- Complete secure payments through Razorpay.
- View and manage booking history.
- Submit reviews and ratings after completing a stay.
- Access and view profile information.

### Hosts

- Add new property listings.
- Upload property images using Cloudinary.
- Edit property details and availability.
- Delete listed properties.
- Manage hosted properties from the dashboard.
- View and manage booking requests and reservations.
- Track booking status for hosted properties.

---

## Deployment

### Application

- Render

### Database

- MongoDB Atlas

### Image Storage

- Cloudinary

---

## Developer

**Rushikesh Auti**

---

⭐ If you found this project useful, please consider **starring the repository** on GitHub!