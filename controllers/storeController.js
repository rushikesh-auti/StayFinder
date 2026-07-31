const Home = require("../models/home");
const User = require("../models/user");
const Review = require("../models/review");

exports.getIndex = (req, res, next) => {
  console.log("Session Value: ", req.session);
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "StayFinder Home",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.searchHomes = async (req, res) => {
  const query = req.query.q?.trim() || "";

  let searchQuery = {
    $or: [
      { houseName: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
    ],
  };

  if (!isNaN(query) && query !== "") {
    searchQuery.$or.push({
      price: Number(query),
    });
  }

  const registeredHomes = await Home.find(searchQuery);

  res.render("store/home-list", {
    registeredHomes,
    query,
    pageTitle: "Search Results",
    currentPage: "Home",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getFavouriteList = async (req, res, next) => {
  if (!req.session?.user?._id) {
    return res.redirect("/login");
  }

  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("favourites");
  res.render("store/favourite-list", {
    favouriteHomes: user.favourites,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddToFavourite = async (req, res, next) => {
  if (!req.session?.user?._id) {
    return res.redirect("/login");
  }

  const homeId = req.body.id;
  const userId = req.session.user._id;
  const home = await Home.findById(homeId);

  if (!home) {
    return res.redirect("/homes");
  }

  if (home.host.toString() === userId.toString()) {
    return res.redirect(`/homes/${homeId}`);
  }

  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  if (!req.session?.user?._id) {
    return res.redirect("/login");
  }

  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter((fav) => fav != homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.getHomeDetails = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const reviewError = req.session.reviewError;
    delete req.session.reviewError;
    const home = await Home.findById(homeId);

    if (!home) {
      console.log("Home not found");
      return res.redirect("/homes");
    }

    const reviews = await Review.find({ home: home._id })
      .populate("user")
      .sort({ createdAt: -1 });

    res.render("store/home-detail", {
      home,
      reviews,
      pageTitle: "Home Detail",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
      reviewError,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/homes");
  }
};
