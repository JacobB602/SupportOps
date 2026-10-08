const pool = require("../db/database");

const getAllOrganizations = async () => {
  const result = await pool.query(
    "SELECT * FROM organizations ORDER BY name"
  );

  return result.rows;
};

module.exports = {
  getAllOrganizations,
};