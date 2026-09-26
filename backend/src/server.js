const express = require("express");
const cors = require("cors");
const pool = require("./db/database");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.use("/tickets", ticketRoutes);

pool.query("SELECT NOW()", (error, result) => {
  if (error) {
    console.error("Database connection failed:", error);
  } else {
    console.log("Database connected:", result.rows[0]);
  }
});

app.listen(PORT, () => {
  console.log(`SupportOps backend running on port ${PORT}`);
});