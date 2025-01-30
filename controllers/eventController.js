import Event from "../modals/Events.js";

// Create an event
export const createEvent = async (req, res) => {
  try {
    // Ensure necessary fields are provided
    const { title, description, time, organisedBy } = req.body;
    if (!title || !description || !time || !organisedBy) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create the event
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const { title, description, time, organisedBy } = req.body;
    if (!title || !description || !time || !organisedBy) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an event
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
