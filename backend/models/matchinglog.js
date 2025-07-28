import mongoose from "mongoose";

const MatchingLogSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'RequestInfo', required: true },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  distance: { type: Number, required: true },
  matchedAt: { type: Date, default: Date.now },
  notification_sent: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['active', 'accepted', 'declined','donated','expired'],
    default: 'active'
  }
},{ timestamps: true });

const MatchingLog = mongoose.model('MatchingLog', MatchingLogSchema);
export default MatchingLog;
