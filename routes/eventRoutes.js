const express = require("express");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Public (GET)
router.get("/", getEvents);
router.get("/:id", getEventById);

// Admin-only (POST/PUT/DELETE)
router.post("/", requireAuth, requireAdmin, createEvent);
router.put("/:id", requireAuth, requireAdmin, updateEvent);
router.delete("/:id", requireAuth, requireAdmin, deleteEvent);

module.exports = router;
