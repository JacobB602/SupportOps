const pool = require("../db/database");

const getAllOrganizations = async () => {
  const result = await pool.query(
    "SELECT * FROM organizations ORDER BY name"
  );

  return result.rows;
};

const getOrganizationById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM organizations WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

module.exports = {
  getAllOrganizations,
  getOrganizationById,
};