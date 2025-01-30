// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Alumni from "../modals/alumni.modal.js"; // Your alumni model

// Signup: Register a new alumni
export const signUp = async (req, res) => {
  const { username, email, rguktId, password, phone } = req.body;

  try {
    // Check if the email or RGUKT ID already exists
    const existingAlumni = await Alumni.findOne({
      $or: [{ email }, { rguktId }],
    });
    if (existingAlumni) {
      return res.status(400).json({ message: "Alumni already exists!" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new alumni record
    const newAlumni = new Alumni({
      username,
      email,
      rguktId,
      password: hashedPassword,
      phone,
    });
    console.log(newAlumni);

    // Save to the database
    await newAlumni.save();
    console.log("saved");

    // Generate JWT token
    const token = jwt.sign({ id: newAlumni._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "Alumni registered successfully",
      token, // Send the token in the response
      alumni: newAlumni,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login: Authenticate an alumni and generate token
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if alumni exists
    const alumni = await Alumni.findOne({ email });
    if (!alumni) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password with stored hash
    const isMatch = await bcrypt.compare(password, alumni.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: alumni._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token, // Send the token in the response
      alumni,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
