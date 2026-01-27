const Participant = require("../models/Participant");
const Event = require("../models/Event");

async function createParticipant(req, res, next) {
  try {
    const { event } = req.body;
    if (!event) {
      res.status(400);
      throw new Error("event is required");
    }

    const exists = await Event.exists({ _id: event });
    if (!exists) {
      res.status(400);
      throw new Error("Invalid event id");
    }

    const created = await Participant.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function getParticipants(req, res, next) {
  try {
    const participants = await Participant.find()
      .populate("event", "title date location status")
      .sort({ createdAt: -1 });

    res.json(participants);
  } catch (err) {
    next(err);
  }
}

async function getParticipantById(req, res, next) {
  try {
    const participant = await Participant.findById(req.params.id).populate(
      "event",
      "title date location status"
    );

    if (!participant) {
      res.status(404);
      throw new Error("Participant not found");
    }

    res.json(participant);
  } catch (err) {
    next(err);
  }
}

async function updateParticipant(req, res, next) {
  try {
    if (req.body.event) {
      const exists = await Event.exists({ _id: req.body.event });
      if (!exists) {
        res.status(400);
        throw new Error("Invalid event id");
      }
    }

    const updated = await Participant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      res.status(404);
      throw new Error("Participant not found");
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteParticipant(req, res, next) {
  try {
    const deleted = await Participant.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404);
      throw new Error("Participant not found");
    }
    res.json({ message: "Participant deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createParticipant,
  getParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant
};
