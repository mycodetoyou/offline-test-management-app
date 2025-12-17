import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true
  },

  fatherName: {
    type: String,
    trim: true
  },

  mobile: {
    type: String,
    require: true,
    unique: true
  },

  password: {
    type: String,
    require: true,

  },

  center: {
    type: String
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "verified"],
    default: "pending"
  },

  rollNumber: {
    type: Number
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
});

export default mongoose.model("Student", StudentSchema);