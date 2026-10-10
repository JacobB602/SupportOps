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

const getOrganizationDetails = async (id) => {
  const organizationResult = await pool.query(
    "SELECT id, name, created_at FROM organizations WHERE id = $1",
    [id]
  );

  if (organizationResult.rows.length === 0) {
    return null;
  }

  const schoolsResult = await pool.query(
    `SELECT
       schools.id,
       schools.name,
       schools.created_at
     FROM schools
     WHERE schools.organization_id = $1
     ORDER BY schools.name`,
    [id]
  );

  const schools = await Promise.all(
    schoolsResult.rows.map(async (school) => {
      const usersResult = await pool.query(
        `SELECT id, name, email, role, created_at
         FROM users
         WHERE school_id = $1
         ORDER BY name`,
        [school.id]
      );

      return {
        ...school,
        users: usersResult.rows,
      };
    })
  );

  return {
    ...organizationResult.rows[0],
    schools,
  };
};

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  getOrganizationDetails,
};