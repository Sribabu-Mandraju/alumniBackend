import Event from "../modals/Events.js";
// ✅ Create a new event
export const createEvent = async (req, res) => {
  try {
    const { title, description, time, organisedBy } = req.body;

    // Validate required fields
    if (!title || !description || !time || !organisedBy) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create event
    const event = await Event.create({ title, description, time, organisedBy });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all events with optional filtering and pagination
export const getEvents = async (req, res) => {
  try {
    const { verified, page = 1, limit = 10 } = req.query;
    let filter = {};

    // Filter by verification status (optional)
    if (verified !== undefined) {
      filter.isVerifiedEvent = verified === "true";
    }

    // Pagination
    const events = await Event.find(filter)
      .sort({ time: 1 }) // Sort by event time
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a single event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update an event
export const updateEvent = async (req, res) => {
  try {
    const { title, description, time, organisedBy } = req.body;

    if (!title || !description || !time || !organisedBy) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, time, organisedBy },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Verify or Unverify an Event (Admin Only)
export const verifyEvent = async (req, res) => {
  try {
    const { isVerifiedEvent } = req.body;

    if (typeof isVerifiedEvent !== "boolean") {
      return res.status(400).json({ message: "Invalid verification status" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { isVerifiedEvent },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      message: "Event verification status updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get upcoming events
export const getUpcomingEvents = async (req, res) => {
  try {
    const upcomingEvents = await Event.find({
      time: { $gte: new Date() },
    }).sort({ time: 1 });
    res.status(200).json(upcomingEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get past events
export const getPastEvents = async (req, res) => {
  try {
    const pastEvents = await Event.find({ time: { $lt: new Date() } }).sort({
      time: -1,
    });
    res.status(200).json(pastEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
