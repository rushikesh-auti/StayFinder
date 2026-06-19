exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "Login",
    editing: false,
  });
};

exports.postLogin = (req, res, next) => {
  res.redirect("/");
};

