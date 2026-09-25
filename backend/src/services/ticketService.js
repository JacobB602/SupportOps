const pool = require("../db/database");

const getAllTickets = async () => {
  const result = await pool.query(
    "SELECT * FROM tickets ORDER BY created_at DESC"
  );

  return result.rows;
};

const getTicketById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM tickets WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

const createTicket = async (title, description, priority) => {
  const result = await pool.query(
    `INSERT INTO tickets (title, description, priority)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, description, priority]
  );

  return result.rows[0];
};

const updateTicket = async (id, title, description, priority, status) => {
  const result = await pool.query(
    `UPDATE tickets
     SET title = $1,
         description = $2,
         priority = $3,
         status = $4
     WHERE id = $5
     RETURNING *`,
    [title, description, priority, status, id]
  );

  return result.rows[0];
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