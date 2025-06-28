// trackingController.js

import dayjs from 'dayjs';
import User from '../models/users.js';
import RequestInfo from '../models/requestinfo.js';
import DonationHistory from '../models/donationhistory.js';


export const getAppTrackingStats = async (req, res) => {
  try {
    const now = dayjs();

    // Calculate month start/end dates
    const startOfThisMonth = now.startOf('month').toDate();
    const endOfThisMonth = now.endOf('month').toDate();
    const startOfLastMonth = now.subtract(1, 'month').startOf('month').toDate();
    const endOfLastMonth = now.subtract(1, 'month').endOf('month').toDate();

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


    // Format blood group data into an object
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const bloodTypeDistribution = {};
    for (const type of bloodTypes) {
      bloodTypeDistribution[type] = await User.countDocuments({ bloodType: type });
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
    });
  } catch (error) {
    console.error('Error in getAppTrackingStats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
