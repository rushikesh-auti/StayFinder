// Core Module
const path = require("path");

// External Module
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');

// Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const bookingRouter = require("./routes/bookingRouter");
const paymentRouter = require("./routes/paymentRouter");
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");

const app = express();
const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER === "true";

app.set("view engine", "ejs");
app.set("views", "views");
app.set("trust proxy", 1);

const store = new MongoDBStore({
  uri: process.env.DB_PATH,
  collection: 'sessions'
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg", "image/jpg"];

  cb(null, allowed.includes(file.mimetype));
};

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 500 * 1024,
  },
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}));

app.use((req, res, next) => {
  if (!req.session.isLoggedIn) {
    req.session.redirectTo = req.originalUrl;
  }
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use(multer(multerOptions).single("photo"));
app.use(express.static(path.join(rootDir, "public")));

app.use(authRouter);

app.use("/homes", (req, res, next) => {
  if (req.isLoggedIn) {
    return next();
  }
  return res.redirect("/login");
});

app.use("/favourites", (req, res, next) => {
  if (req.isLoggedIn) {
    return next();
  }
  return res.redirect("/login");
});

app.use(storeRouter);
app.use("/bookings", (req, res, next) => {
  if (req.isLoggedIn) {
    return next();
  }
  return res.redirect("/login");
});

app.use("/bookings", bookingRouter);
app.use("/payment", paymentRouter);

app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});
app.use("/host", hostRouter);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError &&
    err.code === "LIMIT_FILE_SIZE") {

    return res.status(400).render("host/edit-home", {
      pageTitle: req.body.id ? "Edit Home" : "Add Home",
      currentPage: req.body.id ? "host-homes" : "addHome",
      editing: !!req.body.id,

      home: {
        _id: req.body.id || "",
        houseName: req.body.houseName || "",
        price: req.body.price || "",
        location: req.body.location || "",
        rating: req.body.rating || "",
        description: req.body.description || "",
      },

      errorMessage: "Image size must be less than 500 KB.",

      isLoggedIn: req.session?.isLoggedIn,
      user: req.session?.user,
    });
  }

  next(err);
});

app.use(errorsController.pageNotFound);

const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.DB_PATH)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });