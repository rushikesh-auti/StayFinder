const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
    isLoggedIn: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    currentPage: "signup",
    isLoggedIn: false,
    errors: [],
    oldInput: { firstName: "", lastName: "", email: "", userType: "" },
  });
};

exports.postSignup = [
  // First Name
  check('firstName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('First name must be least 2 characters long')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters'),

  // Last Name
  check('lastName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last name must be least 2 characters long')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters'),

  // Email
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),

  // password
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain at least one number")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password should contain at least one special character")
    .trim(),

  // confirmPassword
  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  // User type
  check("userType")
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(['guest', 'host'])
    .withMessage("Invalid user type"),

  // Terms Accepted
  check("terms")
    .notEmpty()
    .withMessage("Please accept the terms and conditions")
    .custom((value, { req }) => {
      if (value !== "on") {
        throw new Error("Please accept the terms and conditions");
      }
      return true;
    }),

  (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        currentPage: "signup",
        isLoggedIn: false,
        errors: errors.array().map((err) => err.msg),
        oldInput: {
          firstName,
          lastName,
          email,
          userType,
        },
      });
    }

    // To check existing user
    User.findOne({ email })
      .then((existingUser) => {
        if (existingUser) {
          return res.status(422).render("auth/signup", {
            pageTitle: "Signup",
            currentPage: "signup",
            isLoggedIn: false,
            errors: ["Email already exists"],
            oldInput: {
              firstName,
              lastName,
              email,
              userType,
            },
          });
        }

        return bcrypt.hash(password, 12)
          .then((hashedPassword) => {

            const user = new User({
              firstName,
              lastName,
              email,
              password: hashedPassword,
              userType,
            });

            return user.save();
          });
      })
      .then((savedUser) => {
        if (savedUser) {
          return res.redirect("/login");
        }
      })
      .catch((err) => {
        console.log("Error While Saving User:", err);

        return res.status(500).render("auth/signup", {
          pageTitle: "Signup",
          currentPage: "signup",
          isLoggedIn: false,
          errors: ["Something went wrong. Please try again."],
          oldInput: {
            firstName,
            lastName,
            email,
            userType,
          },
        });
      });
  }
];

exports.postLogin = (req, res, next) => {
  console.log(req.body);
  req.session.isLoggedIn = true;
  // res.cookie("isLoggedIn", true);
  res.redirect("/");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
