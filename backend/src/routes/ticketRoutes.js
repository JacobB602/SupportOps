const express = require("express");
const ticketController = require("../controllers/ticketController");

const router = express.Router();

router.get("/", ticketController.getAllTickets);
router.get("/:id", ticketController.getTicketById);
router.post("/", ticketController.createTicket);
router.patch("/:id", ticketController.updateTicket);
router.delete("/:id", ticketController.deleteTicket);

module.exports = router;