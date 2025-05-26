import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true }, // Roll number
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
//   role: {
//     type: String,
//     enum: ['user', 'vendor'],
//     default: 'user'
//   }
});

export default mongoose.model('User', userSchema);