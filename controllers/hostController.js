const Home = require("../models/home");
const cloudinary = require("../config/cloudinary");

const streamUpload = (buffer, folder = "StayFinder") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

exports.getAddHome = (req, res) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    currentPage: "addHome",
    editing: false,
    errorMessage: null,
    home: {},
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = async (req, res) => {
  try {
    const { homeId } = req.params;
    const editing = req.query.editing === "true";

    const home = await Home.findOne({
      _id: homeId,
      host: req.session.user._id,
    }).lean();

    if (!home) {
      return res.redirect("/host/host-home-list");
    }

    res.render("host/edit-home", {
      pageTitle: "Edit Home",
      currentPage: "host-homes",
      editing,
      home,
      errorMessage: null,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });

  } catch (err) {
    console.error("Error loading home:", err);

    res.status(500).render("500", {
      pageTitle: "Server Error",
      errorMessage: "Something went wrong.",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  }
};

exports.getHostHomes = async (req, res) => {
  try {
    const registeredHomes = await Home.find({
      host: req.session.user._id,
    }).lean();

    res.render("host/host-home-list", {
      registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });

  } catch (err) {
    console.error("Error fetching homes:", err);

    res.status(500).render("500", {
      pageTitle: "Server Error",
      errorMessage: "Something went wrong.",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  }
};

exports.postAddHome = async (req, res) => {
  try {
    const {
      houseName,
      price,
      location,
      rating,
      description,
    } = req.body;

    if (!req.file) {
      return res.status(422).render("host/edit-home", {
        pageTitle: "Add Home",
        currentPage: "addHome",
        editing: false,
        errorMessage: "Please upload an image.",
        home: req.body,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
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
      host: req.session.user._id,
    });

    await home.save();

    console.info("Home saved successfully.");

    res.redirect("/host/host-home-list");

  } catch (err) {
    console.error("Error adding home:", err);

    res.status(500).render("host/edit-home", {
      pageTitle: "Add Home",
      currentPage: "addHome",
      editing: false,
      errorMessage: "Failed to add home. Please try again.",
      home: req.body,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  }
};

exports.postEditHome = async (req, res) => {
  try {
    const {
      id,
      houseName,
      price,
      location,
      rating,
      description,
    } = req.body;

    const home = await Home.findOne({
      _id: id,
      host: req.session.user._id,
    });

    if (!home) {
      return res.redirect("/host/host-home-list");
    }

    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;

    if (req.file) {

      // Upload new image
      const result = await streamUpload(req.file.buffer);

      // Delete old image
      try {
        if (home.photoId) {
          await cloudinary.uploader.destroy(home.photoId);
        }
      } catch (cloudinaryError) {
        console.error("Cloudinary delete failed:", cloudinaryError.message);
      }

      home.photo = result.secure_url;
      home.photoId = result.public_id;
    }

    await home.save();

    console.info("Home updated successfully.");

    res.redirect("/host/host-home-list");

  } catch (err) {
    console.error("Error updating home:", err);

    const home = {
      _id: req.body.id,
      houseName: req.body.houseName,
      price: req.body.price,
      location: req.body.location,
      rating: req.body.rating,
      description: req.body.description,
    };

    res.status(500).render("host/edit-home", {
      pageTitle: "Edit Home",
      currentPage: "host-homes",
      editing: true,
      home,
      errorMessage: "Failed to update home. Please try again.",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  }
};

exports.postDeleteHome = async (req, res) => {
  try {

    const home = await Home.findById(req.params.homeId);

    if (!home) {
      return res.redirect("/host/host-home-list");
    }

    try {
      if (home.photoId) {
        await cloudinary.uploader.destroy(home.photoId);
      }
    } catch (cloudinaryError) {
      console.error("Cloudinary delete failed:", cloudinaryError.message);
    }
git 
    await Home.deleteOne({
      _id: home._id,
      host: req.session.user._id,
    });

    console.info("Home deleted successfully.");

    res.redirect("/host/host-home-list");

  } catch (err) {
    console.error("Error deleting home:", err);

    res.status(500).render("500", {
      pageTitle: "Server Error",
      errorMessage: "Something went wrong.",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  }
};