const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      email: ""
    },
    user: {},
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    currentPage: "signup",
    isLoggedIn: false,
    errors: [],
    oldInput: { firstName: "", lastName: "", email: "", userType: "" },
    user: {},
  });
};

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const profileUser = await User.findById(userId).populate("favourites");

    if (!profileUser) {
      req.flash("error", "User not found.");
      return res.redirect("/");
    }

    res.render("auth/profile", {
      pageTitle: "Profile",
      currentPage: "profile",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
      profileUser,
      favouritesCount: profileUser.favourites?.length || 0,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
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


  check("terms")
    .equals("on")
    .withMessage("Please accept the terms and conditions"),

  (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map((err) => err.msg);
      req.flash("error", validationErrors[0]);

      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        currentPage: "signup",
        isLoggedIn: false,
        errors: validationErrors,
        oldInput: {
          firstName,
          lastName,
          email,
          userType,
        },
        user: {},
      });
    }

    // To check existing user
    User.findOne({ email })
      .then((existingUser) => {
        if (existingUser) {
          req.flash("error", "Email already exists");

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
            user: {},
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
          req.flash("success", "Account created successfully. Please log in.");
          return res.redirect("/login");
        }
      })
      .catch((err) => {
        console.log("Error While Saving User:", err);
        req.flash("error", "Something went wrong. Please try again.");

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
          user: {},
        });
      });
  }
];

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "Invalid email or password");

      return res.status(422).render("auth/login", {
        pageTitle: "Login",
        currentPage: "login",
        isLoggedIn: false,
        errors: ["Invalid email or password"],
        oldInput: { email },
        user: {},
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      req.flash("error", "Invalid email or password");

      return res.status(422).render("auth/login", {
        pageTitle: "Login",
        currentPage: "login",
        isLoggedIn: false,
        errors: ["Invalid email or password"],
        oldInput: { email },
        user: {},
      });
    }

    req.session.isLoggedIn = true;

    req.session.user = user;
    req.flash("success", "Welcome back!");

    await req.session.save((err) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/");
    });

  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong. Please try again.");

    res.status(500).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Something went wrong. Please try again."],
      oldInput: { email: req.body.email },
      user: {},
    });
  }
};

exports.postLogout = (req, res, next) => {
  req.session.isLoggedIn = false;
  req.session.user = null;
  req.flash("success", "You have been logged out successfully.");

  req.session.save((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    res.redirect("/login");
  });
};