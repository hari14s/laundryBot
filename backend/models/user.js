import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: { 
    type: String, 
    unique: true, 
    required: true 
  },
  dauthId: {
    type: Number,
    required: true,
    unique: true
  },
  department: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);