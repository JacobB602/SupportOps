
const pool = require("../db/database");

const getAllUsers = async () => {
  const result = await pool.query(`
    SELECT
      users.id,
      users.name,
      users.email,
      users.role,
      schools.id AS school_id,
      schools.name AS school_name,
      organizations.id AS organization_id,
      organizations.name AS organization_name
    FROM users
    JOIN schools ON users.school_id = schools.id
    JOIN organizations
      ON schools.organization_id = organizations.id
    ORDER BY users.name
  `);

  return result.rows;
};

module.exports = {
  getAllUsers,
};