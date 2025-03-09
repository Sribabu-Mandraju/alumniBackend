import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Alumni from "../modals/alumni.modal.js";

// Utility function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Signup: Register a new alumni
export const signUp = async (req, res) => {
  try {
    let { username, email, rguktId, password, phone } = req.body;
    email = email?.trim().toLowerCase();

    if (!username || !email || !rguktId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (await Alumni.findOne({ $or: [{ email }, { rguktId }] })) {
      return res.status(400).json({ message: "Alumni already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newAlumni = await Alumni.create({
      username,
      email,
      rguktId,
      password: hashedPassword,
      phone,
    });

    res.status(201).json({
      message: "Alumni registered successfully",
      token: generateToken(newAlumni._id),
      alumni: { id: newAlumni._id, username, email, rguktId, phone },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login: Authenticate alumni and generate token
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const alumni = await Alumni.findOne({ email });
    if (!alumni || !(await bcrypt.compare(password, alumni.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(alumni._id),
      alumni: { id: alumni._id, username: alumni.username, email, rguktId: alumni.rguktId, phone: alumni.phone },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getAlumniProfile = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id).populate("donations posts");
    if (!alumni) return res.status(404).json({ message: "Alumni not found" });

    res.status(200).json(alumni);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const updateAlumniProfile = async (req, res) => {
  try {
    const updatedAlumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedAlumni) return res.status(404).json({ message: "Alumni not found" });

    res.status(200).json(updatedAlumni);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
  

};

export const updateProfilePhoto = async (req, res) => {
  try {
    const { profilePhoto } = req.body;

    if (!profilePhoto) {
      return res.status(400).json({ message: "Profile photo URL is required" });
    }

    const updatedAlumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { profilePhoto },
      { new: true }
    );

    res.status(200).json(updatedAlumni);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyAlumniProfile = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { isVerifiedAlumni: true },
      { new: true }
    );

    if (!alumni) return res.status(404).json({ message: "Alumni not found" });

    res.status(200).json({ message: "Alumni verified successfully", alumni });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const addContribution = async (req, res) => {
  try {
    const { contribution } = req.body;

    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { $push: { contributions: contribution } },
      { new: true }
    );

    res.status(200).json(alumni);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const removeContribution = async (req, res) => {
  try {
    const { contribution } = req.body;

    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { $pull: { contributions: contribution } },
      { new: true }
    );

    res.status(200).json(alumni);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const updateCurrentPosition = async (req, res) => {
  try {
    const { workingStatus, company } = req.body;

    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { currentPosition: { workingStatus, company } },
      { new: true }
    );

    res.status(200).json(alumni);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const addPost = async (req, res) => {
  try {
    const { postId } = req.body;

    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { $push: { posts: postId } },
      { new: true }
    );

    res.status(200).json(alumni);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteAlumni = async (req, res) => {
  try {
    await Alumni.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Alumni deleted successfully" });
  } catch (error) {
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
