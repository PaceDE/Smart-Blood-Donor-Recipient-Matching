import mongoose from 'mongoose';

const RequestInfoSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who requested blood
  bloodType: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 
    required: true 
  },
  address: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  hospital: {type:String},
  unitsNeeded: Number,
  description: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'canceled'], 
    default: 'pending' 
  },
},{ timestamps: true });


const RequestInfo = mongoose.model('RequestInfo', RequestInfoSchema);
export default RequestInfo;
