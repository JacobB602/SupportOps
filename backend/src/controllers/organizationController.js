const organizationService = require("../services/organizationService");

const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await organizationService.getAllOrganizations();

    res.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ error: "Failed to fetch organizations" });
  }
};

module.exports = {
  getAllOrganizations,
};