const Event = require("../models/Event");

async function createEvent(req, res, next) {
  try {
    const created = await Event.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function getEvents(req, res, next) {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
}

async function getEventById(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }
    res.json(event);
  } catch (err) {
    next(err);
  }
}

async function updateEvent(req, res, next) {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      res.status(404);
      throw new Error("Event not found");
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteEvent(req, res, next) {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404);
      throw new Error("Event not found");
    }
    res.json({ message: "Event deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = { createEvent, getEvents, getEventById, updateEvent, deleteEvent };
