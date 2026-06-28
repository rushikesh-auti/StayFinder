const Home = require("../models/home");
const cloudinary = require('../config/cloudinary');

const streamUpload = (buffer, folder = "StayFinder") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );
    stream.end(buffer);
  });
};

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host/host-home-list");
    }

    console.log(homeId, editing, home);
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.postAddHome = async (req, res, next) => {
  const { houseName, price, location, rating, description } =
    req.body;

  if (!req.file) {
    return res.status(422).send("No Image Provided");
  }

  const result = await streamUpload(req.file.buffer, "StayFinder");

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    description,
    photo: result.secure_url,
    photoId: result.public_id,
  });
  await home.save().then(() => {
    console.log("Home Saved successfully");
  });
  res.redirect("/host/host-home-list");
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

      if (home.photoId) {
        await cloudinary.uploader.destroy(home.photoId);
      }

      const result = await streamUpload(req.file.buffer, "StayFinder");

      home.photo = result.secure_url;
      home.photoId = result.public_id;
    }

    await home.save();

    console.log("Home updated");
    res.redirect("/host/host-home-list");

  } catch (err) {
    console.log(err);
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

        res.redirect("/host/host-home-list");

    } catch (err) {
        console.log(err);
    }
};