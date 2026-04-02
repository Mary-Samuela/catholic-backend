import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ── Protect: must be logged in ──
export const protect = async (req, res, next) => {
  try {
    let token;

    // Token comes in the header as: Authorization: Bearer <token>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorised, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (excluding password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorised, token failed" });
  }
};

// ── Admin: must be logged in AND be an admin ──
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorised as admin" });
  }
};
