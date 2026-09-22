import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "default_jwt_secret_key_2026";

// Verify JWT Token Middleware
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.headers["x-access-token"] || req.query?.token || req.body?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Authentication token required."
    });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid, tampered, or expired token."
      });
    }
    req.user = decoded;
    next();
  });
};

// Role-Based Access Control (RBAC) Middleware
export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: No user role identified."
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: This action requires one of the following roles: [${allowedRoles.join(", ")}]. Your current role is '${req.user.role}'.`
      });
    }

    next();
  };
};
