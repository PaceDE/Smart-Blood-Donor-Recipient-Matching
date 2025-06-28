import mongoose from "mongoose";


const DonationHistorySchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'RequestInfo', required: true },
  donatedAt: { type: Date, default: Date.now },
},{ timestamps: true });

const DonationHistory = mongoose.model('DonationHistory', DonationHistorySchema);
export default DonationHistory;
