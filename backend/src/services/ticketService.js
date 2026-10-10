
const pool = require("../db/database");

const ticketQuery = `
  SELECT
    tickets.*,
    users.name AS caller_name,
    users.email AS caller_email,
    users.role AS caller_role,
    schools.id AS school_id,
    schools.name AS school_name,
    organizations.id AS organization_id,
    organizations.name AS organization_name
  FROM tickets
  LEFT JOIN users ON tickets.user_id = users.id
  LEFT JOIN schools ON users.school_id = schools.id
  LEFT JOIN organizations ON schools.organization_id = organizations.id
`;

const getAllTickets = async () => {
  const result = await pool.query(
    `${ticketQuery} ORDER BY tickets.created_at DESC`
  );

  return result.rows;
};

const getTicketById = async (id) => {
  const result = await pool.query(
    `${ticketQuery} WHERE tickets.id = $1`,
    [id]
  );

  return result.rows[0];
};

const createTicket = async (
  title,
  description,
  priority,
  userId = null
) => {
  const result = await pool.query(
    `INSERT INTO tickets (title, description, priority, user_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [title, description, priority, userId]
  );

  return getTicketById(result.rows[0].id);
};

const updateTicket = async (
  id,
  title,
  description,
  priority,
  status
) => {
  await pool.query(
    `UPDATE tickets
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         priority = COALESCE($3, priority),
         status = COALESCE($4, status)
     WHERE id = $5`,
    [title, description, priority, status, id]
  );

  return getTicketById(id);
};

const deleteTicket = async (id) => {
  const result = await pool.query(
    "DELETE FROM tickets WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
};

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
};