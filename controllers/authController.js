// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Alumni from "../modals/alumni.modal.js"; // Your alumni model

// Signup: Register a new alumni
export const signUp = async (req, res) => {
  const { username, email, rguktId, password, phone } = req.body;
  console.log(password);
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
    console.log(token);

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
  console.log(req.body);

  try {
    // Check if alumni exists
    const alumni = await Alumni.findOne({ email });
    console.log(alumni);
    if (!alumni) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password with stored hash
    const isMatch = await bcrypt.compare(password, alumni.password);
    console.log(isMatch);
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

/**
 * @swagger
 * /alumni/request-verification:
 *   post:
 *     summary: Request alumni verification
 *     description: Alumni can request to be verified by an admin.
 *     tags:
 *       - Alumni
 *     responses:
 *       200:
 *         description: Verification request submitted successfully
 *       404:
 *         description: Alumni not found
 *       500:
 *         description: Server error
 */
export const requestAlumniVerification = async (req, res) => {
  try {
    const alumniId = req.user.id;

    const alumni = await Alumni.findById(alumniId);
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    if (alumni.isVerifiedAlumni) {
      return res.status(400).json({ message: "Alumni is already verified" });
    }

    alumni.isRequestedToVerifyAlumni = true;
    await alumni.save();

    res.status(200).json({ message: "Verification request submitted successfully" });
  } catch (err) {
    console.error("Error submitting verification request:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 * /alumni/verify/{id}:
 *   patch:
 *     summary: Verify an alumni
 *     description: Admin can verify an alumni based on their ID.
 *     tags:
 *       - Alumni
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the alumni to verify
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Alumni verified successfully
 *       404:
 *         description: Alumni not found
 *       500:
 *         description: Server error
 */
export const verifyAlumni = async (req, res) => {
  try {
    const { id } = req.params;

    const alumni = await Alumni.findById(id);
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    alumni.isVerifiedAlumni = true;
    alumni.isRequestedToVerifyAlumni = false;
    await alumni.save();

    res.status(200).json({ message: "Alumni verified successfully" });
  } catch (err) {
    console.error("Error verifying alumni:", err);
    res.status(500).json({ message: "Server error" });
  }
};
