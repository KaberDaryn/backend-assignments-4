const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const token = header.slice("Bearer ".length).trim();
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: "JWT_SECRET is not set" });
  }

  try {
    const payload = jwt.verify(token, secret);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  return next();
}

module.exports = { requireAuth, requireAdmin };
