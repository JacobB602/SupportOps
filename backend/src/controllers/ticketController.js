const ticketService = require("../services/ticketService");

const getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketService.getAllTickets();

    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};

const getTicketsByUserId = async (req, res) => {
  try {
    const tickets = await ticketService.getTicketsByUserId(
      req.params.userId
    );

    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets for user:", error);
    res.status(500).json({
      error: "Failed to fetch tickets for user",
    });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
};


const createTicket = async (req, res) => {
  try {
    const { title, description, priority, userId } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Ticket title is required" });
    }

    const ticket = await ticketService.createTicket(
      title.trim(),
      description,
      priority,
      userId ?? null
    );

    res.status(201).json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);

    if (error.code === "23503") {
      return res.status(400).json({
        error: "The selected caller does not exist",
      });
    }

    res.status(500).json({ error: "Failed to create ticket" });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;

    const ticket = await ticketService.updateTicket(
      req.params.id,
      title ?? null,
      description ?? null,
      priority ?? null,
      status ?? null
    );

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ error: "Failed to update ticket" });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const ticket = await ticketService.deleteTicket(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ error: "Failed to delete ticket" });
  }
};

module.exports = {
  getAllTickets,
  getTicketsByUserId,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
};