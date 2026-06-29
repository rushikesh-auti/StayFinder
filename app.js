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
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const store = new MongoDBStore({
  uri: process.env.DB_PATH,
  collection: 'sessions'
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg", "image/jpg"];

  cb(null, allowed.includes(file.mimetype));
};

const multerOptions = {
  storage: multer.memoryStorage(), fileFilter
};

app.use(express.urlencoded({ extended: true }));
app.use(multer(multerOptions).single('photo'));
app.use(express.json());
app.use(express.static(path.join(rootDir, "public")));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
}));

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});
app.use("/host", hostRouter);

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
