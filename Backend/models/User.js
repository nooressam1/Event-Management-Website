import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { BCRYPT_ROUNDS } from "./enum.js";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
  },
  { timestamps: true }, //auto-adds createdAt-UpdatedAt
);

// Hash password before saving (never leave unhashed password)
userSchema.pre("save", async function () {
  // if password not changed then continue
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, BCRYPT_ROUNDS);
});

// Compare password method for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON responses (security)
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// exports to live database
export default mongoose.model("User", userSchema);
