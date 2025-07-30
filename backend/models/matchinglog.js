import mongoose from "mongoose";

const MatchingLogSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'RequestInfo', required: true,index:true },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donorBloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true,
  },
  distance: { type: Number, required: true },
  matchedAt: { type: Date, default: Date.now },
  notification_sent: { type: Boolean, default: false },
  read:{type:Boolean,default:false},
  status: {
    type: String,
    enum: ['active', 'accepted', 'declined','donated','expired'],
    default: 'active',
    index:true,
  }
},{ timestamps: true });

const MatchingLog = mongoose.model('MatchingLog', MatchingLogSchema);
export default MatchingLog;
