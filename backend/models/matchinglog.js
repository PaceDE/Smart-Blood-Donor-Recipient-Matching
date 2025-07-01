import mongoose from "mongoose";

const MatchingLogSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'RequestInfo', required: true },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matchedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['active', 'accepted', 'cancelled','completed'],
    default: 'active'
  }
},{ timestamps: true });

const MatchingLog = mongoose.model('MatchingLog', MatchingLogSchema);
export default MatchingLog;
