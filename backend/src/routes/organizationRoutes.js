const express = require("express");
const organizationController = require("../controllers/organizationController");

const router = express.Router();

router.get("/", organizationController.getAllOrganizations);

module.exports = router;