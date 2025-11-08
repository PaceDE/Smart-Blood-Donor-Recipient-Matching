// trackingController.js

import dayjs from 'dayjs';
import User from '../models/users.js';
import RequestInfo from '../models/requestinfo.js';
import DonationHistory from '../models/donationhistory.js';


export const getAppTrackingStats = async (req, res) => {
  try {
    const now = new Date();

    // Calculate month start/end dates
    const startOfThisMonth = new Date(now.getFullYear(),now.getMonth(),1);
    const endOfThisMonth = new Date(now.getFullYear(),now.getMonth()+1,0,23,59,59,999);
    const startOfLastMonth = new Date(now.getFullYear(),now.getMonth()-1,1);
    const endOfLastMonth = new Date(now.getFullYear(),now.getMonth(),0,23,59,59,999);

    // Total registered users
    const totalUsers = await User.countDocuments();

    // User registrations this and last month
    const usersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth }
    });
    const usersLastMonth = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const userGrowth = usersLastMonth === 0 
      ? 100 
      : ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100;

    // Total donations and requests
    const totalDonations = await DonationHistory.countDocuments();
    const donationThisMonth = await DonationHistory.countDocuments({
      createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth }
    });
     const donationLastMonth = await DonationHistory.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const donationGrowth = donationThisMonth === 0 ? 0 : (donationLastMonth === 0 ? 100:  ((donationThisMonth - donationLastMonth) / donationLastMonth) * 100 );
    
    
    const totalRequests = await RequestInfo.countDocuments();
    const requestThisMonth = await RequestInfo.countDocuments({
      createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth }
    });
     const requestLastMonth = await RequestInfo.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const requestGrowth = requestThisMonth === 0 ? 0 : (requestLastMonth === 0 ? 100:  ((requestThisMonth - requestLastMonth) / requestLastMonth) * 100 );


    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const bloodTypeDistribution = {};
    for (const type of bloodTypes) {
      bloodTypeDistribution[type] = await User.countDocuments({ bloodType: type });
    }

    const bloodReqDistribution ={};
    for (const type of bloodTypes) {
      bloodReqDistribution[type] = await RequestInfo.countDocuments({ bloodType: type });
    }

    const bloodDonateDistribution ={};
    const donors = await DonationHistory.find().populate({path:'donor',select:'bloodType'})
    for (const type of bloodTypes) {
      const currentDonor = donors.filter((d)=> d.donor?.bloodType==type)
      bloodDonateDistribution[type] = currentDonor.length;
    }

    res.json({
      totalUsers,
      usersThisMonth,
      usersLastMonth,
      userGrowth: userGrowth.toFixed(2),
      totalDonations,
      donationGrowth: donationGrowth.toFixed(2),
      totalRequests,
      requestGrowth: requestGrowth.toFixed(2),
      bloodTypeDistribution,
      bloodReqDistribution,
      bloodDonateDistribution
    });
  } catch (error) {
    console.error('Error in getAppTrackingStats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
