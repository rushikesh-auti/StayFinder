exports.getPrivacy = (req, res) => {
  res.render("pages/privacy", {
    pageTitle: "Privacy Policy",
    user: req.session.user || null,
  });
};

exports.getTerms = (req, res) => {
  res.render("pages/terms", {
    pageTitle: "Terms & Conditions",
    user: req.session.user || null,
  });
};

exports.getContact = (req, res) => {
  res.render("pages/contact", {
    pageTitle: "Contact Us",
    user: req.session.user || null,
  });
};