import mongoose from 'mongoose';

const RequestInfoSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,index:true }, 
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  urgency: { type: String },
  description: { type: String },
  hospital: { type: String },
  searchDistance: { type: Number },
  address: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  matchedCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending',
    index:true
  },
}, { timestamps: true });


const RequestInfo = mongoose.model('RequestInfo', RequestInfoSchema);
export default RequestInfo;
