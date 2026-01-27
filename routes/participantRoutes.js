const express = require("express");
const {
  createParticipant,
  getParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant
} = require("../controllers/participantController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Public (GET)
router.get("/", getParticipants);
router.get("/:id", getParticipantById);

// Admin-only (POST/PUT/DELETE)
router.post("/", requireAuth, requireAdmin, createParticipant);
router.put("/:id", requireAuth, requireAdmin, updateParticipant);
router.delete("/:id", requireAuth, requireAdmin, deleteParticipant);

module.exports = router;
