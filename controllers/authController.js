const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ id: user._id.toString(), role: user.role }, secret, { expiresIn });
}

async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("email and password are required");
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409);
      throw new Error("Email is already in use");
    }

    // Public registration always creates a normal user.
    const user = await User.create({ email, password, role: "user" });

    const token = signToken(user);
    res.status(201).json({
      user: { id: user._id, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const token = signToken(user);
    res.json({
      user: { id: user._id, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
