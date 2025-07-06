import mongoose from 'mongoose';

const healthInfoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total_donations: { type: Number, required: true },
  last_donation_date: { 
    type: Date, default: new Date('2000-01-01') 
  },
  has_disease: { type: Boolean, default: false },

  recently_gave_birth: {
    type: Date,
    default:null
  },

  recent_piercing_or_tattoo: {
    type: Date,
    default:null
  },

  weight_kg: { type: Number, required: true },
  willingness_level: { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });

const HealthInfo = mongoose.model('HealthInfo', healthInfoSchema);
export default HealthInfo;
