exports.getPrivacy = (req, res) => {
  res.render("pages/privacy", {
    pageTitle: "Privacy Policy",
    currentPage: "privacy",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user || null,
  });
};

exports.getTerms = (req, res) => {
  res.render("pages/terms", {
    pageTitle: "Terms & Conditions",
    currentPage: "terms",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user || null,
  });
};

exports.getContact = (req, res) => {
  res.render("pages/contact", {
    pageTitle: "Contact",
    currentPage: "contact",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user || null,
  });
};
