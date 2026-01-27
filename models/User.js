const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
