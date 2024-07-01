import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: Schema.Types.Mixed,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
  },
  attempts: {
    type: Number,
  },
  loginLimit: {
    type: Number,
  },
  token: {
    type: Schema.Types.Mixed,
  },
  rateLimit: {
    type: Number,
  },
  loginAttempt: {
    type: Number,
  },
  loginTime: {
    type: Schema.Types.Mixed,
  },
});

export default mongoose.model("user", userSchema);
