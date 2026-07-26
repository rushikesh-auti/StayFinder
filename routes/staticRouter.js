const express = require("express");
const router = express.Router();
const staticController = require("../controllers/staticController");

router.get("/privacy", staticController.getPrivacy);
router.get("/terms", staticController.getTerms);
router.get("/contact", staticController.getContact);

module.exports = router;