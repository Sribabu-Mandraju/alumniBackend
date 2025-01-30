import Admin from "../modals/admin.modal.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * @swagger
 * /admin/create:
 *   post:
 *     summary: Create a new admin
 *     description: Create a new admin user by providing email, name, role, and password.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Email is already taken
 *       500:
 *         description: Server error
 */
export const createAdmin = async (req, res) => {
  try {
    const { email, name, role, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      email,
      name,
      role,
      password: hashedPassword,
    });

    await newAdmin.save();
    res
      .status(201)
      .json({ message: "Admin created successfully", admin: newAdmin });
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     description: Log in an admin with email and password to receive a JWT token.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 *       404:
 *         description: Admin not found
 *       400:
 *         description: Invalid password
 *       500:
 *         description: Server error
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Error logging in admin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 * /admin/details:
 *   get:
 *     summary: Get admin details
 *     description: Fetch the details of the logged-in admin.
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Admin details fetched successfully
 *       500:
 *         description: Server error
 */
export const getAdminDetails = (req, res) => {
  res.status(200).json({
    message: "Admin details fetched successfully",
    admin: req.user,
  });
};

/**
 * @swagger
 * /admin/details/token:
 *   get:
 *     summary: Get admin details by token
 *     description: Fetch the details of the admin based on the provided JWT token.
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Admin details fetched successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */
export const getAdminDetailsByToken = async (req, res) => {
  try {
    const adminId = req.user.id;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Admin details fetched successfully",
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Error fetching admin details:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * @swagger
 * /admin/delete/{id}:
 *   delete:
 *     summary: Delete an admin
 *     description: Delete an admin by their ID.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the admin to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if admin exists
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Delete the admin
    await Admin.findByIdAndDelete(id);

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Error deleting admin:", err);
    res.status(500).json({ message: "Server error" });
  }
};
