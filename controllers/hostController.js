const Home = require("../models/home");
const cloudinary = require("../config/cloudinary");
require("dotenv").config();

const streamUpload = (buffer, folder = process.env.SESSION_SECRET) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });

exports.getAddHome = (req, res) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to Airbnb",
    currentPage: "addHome",
    editing: false,
    errorMessage: null,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = async (req, res) => {
  try {
    const { homeId } = req.params;
    const editing = req.query.editing === "true";

    const home = await Home.findById(homeId);

    if (!home) {
      return res.redirect("/host/host-home-list");
    }

    res.render("host/edit-home", {
      home,
      pageTitle: "Edit Your Home",
      currentPage: "host-homes",
      editing,
      errorMessage: null,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  } catch (err) {
    console.error("Error loading home:", err);
  }
};

exports.getHostHomes = async (req, res) => {
  try {
    const registeredHomes = await Home.find();

    res.render("host/host-home-list", {
      registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  } catch (err) {
    console.error("Error fetching homes:", err);
  }
};

exports.postAddHome = async (req, res) => {
  try {
    const { houseName, price, location, rating, description } = req.body;

    if (!req.file) {
      return res.status(422).send("No image provided.");
    }

    const result = await streamUpload(req.file.buffer);

    const home = new Home({
      houseName,
      price,
      location,
      rating,
      description,
      photo: result.secure_url,
      photoId: result.public_id,
    });

    await home.save();

    console.log("Home saved successfully.");
    res.redirect("/host/host-home-list");
  } catch (err) {
    console.error("Error adding home:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.postEditHome = async (req, res) => {
  try {
    const { id, houseName, price, location, rating, description } = req.body;

    const home = await Home.findById(id);

    if (!home) {
      return res.redirect("/host/host-home-list");
    }

    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;

    if (req.file) {
      const result = await streamUpload(req.file.buffer);

      if (home.photoId) {
        await cloudinary.uploader.destroy(home.photoId);
      }

      home.photo = result.secure_url;
      home.photoId = result.public_id;
    }

    await home.save();

    console.log("Home updated successfully.");
    res.redirect("/host/host-home-list");
  } catch (err) {
    console.error("Error updating home:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.postDeleteHome = async (req, res) => {
  try {
    const home = await Home.findById(req.params.homeId);

    if (!home) {
      return res.redirect("/host/host-home-list");
    }

    if (home.photoId) {
      await cloudinary.uploader.destroy(home.photoId);
    }

    await Home.findByIdAndDelete(home._id);

    console.log("Home deleted successfully.");
    res.redirect("/host/host-home-list");
  } catch (err) {
    console.error("Error deleting home:", err);
    res.status(500).send("Internal Server Error");
  }
};