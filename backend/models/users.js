import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hash before save
  phone: { type: String },
  address: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  bloodType: { type: String, required: true },      
  dateOfBirth: { type: Date, required: true },
  gender: {type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],   
    default: 'user'
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
