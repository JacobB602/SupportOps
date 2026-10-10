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

const getOrganizationById = async (req, res) => {
  try {
    const organization = await organizationService.getOrganizationById(
      req.params.id
    );

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.json(organization);
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({ error: "Failed to fetch organization" });
  }
};

const getOrganizationDetails = async (req, res) => {
  try {
    const organization =
      await organizationService.getOrganizationDetails(req.params.id);

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.json(organization);
  } catch (error) {
    console.error("Error fetching organization details:", error);
    res.status(500).json({
      error: "Failed to fetch organization details",
    });
  }
};

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  getOrganizationDetails,
};