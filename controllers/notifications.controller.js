import Notification from "../models/notifications.modal.js"; // Adjust the path to your model file

// Create a new notification
export const createNotification = async (req, res) => {
  try {
    const { title, description, image, links } = req.body;

    const notification = new Notification({
      title,
      description,
      image,
      links,
    });

    const savedNotification = await notification.save();
    res.status(201).json({
      message: "Notification created successfully!",
      data: savedNotification,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create notification", error: error.message });
  }
};

// Edit an existing notification by ID
export const editNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification updated successfully!",
      data: updatedNotification,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update notification", error: error.message });
  }
};

// Delete a notification by ID
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification deleted successfully!",
      data: deletedNotification,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete notification", error: error.message });
  }
};

// Get a single notification by ID
export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to retrieve notification",
        error: error.message,
      });
  }
};

// Get notifications with pagination and sorted by timestamp (recent first)
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Defaults: page=1, limit=10

    const skip = (page - 1) * limit;
    const notifications = await Notification.find()
      .sort({ timestamp: -1 }) // Sort by most recent
      .skip(skip)
      .limit(Number(limit));

    const totalCount = await Notification.countDocuments();

    res.status(200).json({
      message: "Notifications retrieved successfully!",
      data: notifications,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to retrieve notifications",
        error: error.message,
      });
  }
};
