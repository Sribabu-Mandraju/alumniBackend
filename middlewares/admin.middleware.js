import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const adminTokenCheck = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};

export const isHod = (req, res, next) => {
  if (req.user.role !== "HOD") {
    return res.status(403).json({ message: "Only HOD can create new admins" });
  }
  next();
};
