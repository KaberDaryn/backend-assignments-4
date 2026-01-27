require("dotenv").config();
const path = require("path");
const express = require("express");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const participantRoutes = require("./routes/participantRoutes");

const errorLogger = require("./middleware/errorLogger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

// Serve minimal UI (Assignment 3) while keeping secured API (Assignment 4)
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/participants", participantRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorLogger);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  });
