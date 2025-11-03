import Booking from '../Models/Booking.js';
import Pack from '../Models/Pack.js';
import User from '../Models/User.js';
import mongoose from 'mongoose';


export const createBooking = async (req, res) => {
  try {

    const { packID, isVip = false, spotsBooked = 1 } = req.body;
    const userID = req.user?.id

    if (!userID || !packID || spotsBooked < 1) {
      return res.status(400).json({ message: 'userID, packID, and valid spotsBooked are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(packID)) {
      return res.status(400).json({ message: 'Invalid pack ID.' });
    }

    const trip = await Pack.findById(packID);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const user = await User.findOne({ _id: userID, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found or has been deleted.' });
    }
    

    const existingBookings = await Booking.find({ packID, isCancelled: false });

    // VIP logic
    if (isVip) {
      if (existingBookings.length > 0) {
        return res.status(403).json({ message: 'VIP booking not allowed. This pack already has bookings.' });
      }
    } else {
      const vipExists = existingBookings.some(b => b.isVip);
      if (vipExists) {
        return res.status(403).json({ message: 'Normal booking not allowed. This pack is reserved for a VIP.' });
      }
    }

    // Calculate total spots already booked
    const totalSpotsBooked = existingBookings.reduce((sum, b) => sum + (b.spotsBooked || 1), 0);

    if (totalSpotsBooked + spotsBooked > trip.maxClients) {
      return res.status(403).json({ message: 'Not enough spots available for this booking.' });
    }

    const alreadyBooked = existingBookings.find(b => b.userID.toString() === userID);
    if (alreadyBooked) {
      return res.status(409).json({ message: 'You have already booked this trip.' });
    }

    const newBooking = new Booking({ userID, packID, isVip, spotsBooked });
    await newBooking.save();

    res.status(201).json({ message: 'Booking created.', booking: newBooking });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid booking ID.' });
    }

    const booking = await Booking.findById(id).populate('userID packID');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


export const getBookingsByUser = async (req, res) => {
  try {
    const  userID  = req.user?.id;
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const user = await User.findOne({ _id: userID, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const bookings = await Booking.find({ userID }).populate('packID');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Get bookings by user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


export const getBookingsByGuide = async (req, res) => {
  try {
    const guideID = req.user?.id;

    // Validate guideID format
    if (!mongoose.Types.ObjectId.isValid(guideID)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid guide ID.',
        count: 0,
        data: []
      });
    }

    // Check if guide exists and is active
    const guide = await User.findOne({ _id: guideID, role: 'guide', isDeleted: false });
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found.',
        count: 0,
        data: []
      });
    }


    const packs = await Pack.find({ guideId: guideID });
    const packIDs = packs.map(pack => pack._id);

    // Find all bookings for those packs
    const bookings = await Booking.find({ packID: { $in: packIDs } })
      .populate('userID')
      .populate('packID');

    res.status(200).json({
      success: true,
      message: bookings.length === 0
        ? 'No bookings found for this guide.'
        : 'Bookings retrieved successfully.',
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get bookings by guide error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
      count: 0,
      data: []
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingID } = req.params;
    const userID = req.user?.id;

    // Retrieve the booking and ensure userID is populated
    const booking = await Booking.findById(bookingID).populate('userID');

    // Check if the booking exists and is not cancelled
    if (!booking || booking.isCancelled) {
      return res.status(404).json({ message: 'Booking not found or already cancelled.' });
    }
    // Check if userID exists and compare
    const bookingUserId = booking.userID?._id ? booking.userID._id.toString() : booking.userID.toString();
    if (bookingUserId !== userID) {
      return res.status(403).json({ message: 'You can only cancel your own bookings.' });
    }
    // Proceed to cancel the booking
    booking.isCancelled = true;
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    console.error('Cancel error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const userRole = req.user?.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Filtres depuis les query params
    const { userId, packId, startDate, endDate } = req.query;
    
    // Construire la requête de filtrage
    let query = {};
    
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      query.userID = userId;
    }
    
    if (packId && mongoose.Types.ObjectId.isValid(packId)) {
      query.packID = packId;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const bookings = await Booking.find(query)
      .populate('userID', 'name email role')
      .populate('packID', 'title startLocation endLocation startDate endDate price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'All bookings retrieved successfully.',
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Obtenir les statistiques des réservations avec filtres (year, month, week)
export const getMonthlyBookingStats = async (req, res) => {
  try {
    const guideID = req.user?.id;
    const userRole = req.user?.role;

    // Paramètres de filtrage
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
    const filterType = req.query.filterType || 'year'; // 'year', 'month', 'week'
    const month = req.query.month ? parseInt(req.query.month) : null;
    const week = req.query.week ? parseInt(req.query.week) : null;

    let startDate, endDate;
    
    // Définir les dates selon le type de filtre
    if (filterType === 'year') {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59);
    } else if (filterType === 'month' && month) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59);
    } else if (filterType === 'week' && week) {
      // Calculer la semaine
      const firstDay = new Date(year, 0, 1);
      const dayOfWeek = firstDay.getDay();
      const daysToAdd = (week - 1) * 7 - dayOfWeek + 1;
      startDate = new Date(year, 0, 1 + daysToAdd);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59);
    } else {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59);
    }

    let matchCondition = {
      createdAt: { $gte: startDate, $lte: endDate },
      isCancelled: false
    };

    // Si c'est un guide, filtrer par ses packs
    if (userRole === 'guide') {
      const packs = await Pack.find({ guideId: guideID });
      const packIDs = packs.map(pack => pack._id);
      matchCondition.packID = { $in: packIDs };
    }

    let result;

    // Agrégation selon le type de filtre
    if (filterType === 'year') {
      const monthlyStats = await Booking.aggregate([
        { $match: matchCondition },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const monthNames = ["January", "February", "March", "April", "May", "June", 
                          "July", "August", "September", "October", "November", "December"];
      
      result = monthNames.map((month, index) => {
        const stat = monthlyStats.find(s => s._id === index + 1);
        return {
          month: month,
          desktop: stat ? stat.count : 0
        };
      });
    } else if (filterType === 'month') {
      // Agrégation par jour du mois
      const dailyStats = await Booking.aggregate([
        { $match: matchCondition },
        {
          $group: {
            _id: { $dayOfMonth: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const daysInMonth = new Date(year, month, 0).getDate();
      result = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const stat = dailyStats.find(s => s._id === day);
        return {
          month: day.toString(),
          desktop: stat ? stat.count : 0
        };
      });
    } else if (filterType === 'week') {
      // Agrégation par jour de la semaine
      const dailyStats = await Booking.aggregate([
        { $match: matchCondition },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      result = dayNames.map((day, index) => {
        const stat = dailyStats.find(s => s._id === index + 1);
        return {
          month: day,
          desktop: stat ? stat.count : 0
        };
      });
    }

    res.status(200).json({
      success: true,
      year: year,
      filterType: filterType,
      month: month,
      week: week,
      data: result
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error.' 
    });
  }
};

// Get booking status distribution stats for guide
export const getBookingStatusStats = async (req, res) => {
  try {
    const guideID = req.user?.id;
    const userRole = req.user?.role;
    
    // Paramètres de filtrage
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
    const filterType = req.query.filterType || 'year';
    const month = req.query.month ? parseInt(req.query.month) : null;
    const week = req.query.week ? parseInt(req.query.week) : null;

    let matchCondition = {};

    // Si c'est un guide, filtrer par ses packs
    if (userRole === 'guide') {
      const packs = await Pack.find({ guideId: guideID });
      const packIDs = packs.map(pack => pack._id);
      matchCondition.packID = { $in: packIDs };
    }

    // Ajouter le filtre de date
    let startDate, endDate;
    
    if (filterType === 'year') {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59);
    } else if (filterType === 'month' && month) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59);
    } else if (filterType === 'week' && week) {
      const firstDay = new Date(year, 0, 1);
      const dayOfWeek = firstDay.getDay();
      const daysToAdd = (week - 1) * 7 - dayOfWeek + 1;
      startDate = new Date(year, 0, 1 + daysToAdd);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59);
    } else {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59);
    }

    matchCondition.createdAt = { $gte: startDate, $lte: endDate };

    // Récupérer toutes les réservations filtrées
    const allBookings = await Booking.find(matchCondition);

    // Calculer les statuts
    const completed = allBookings.filter(b => b.isCompleted === true).length;
    const cancelled = allBookings.filter(b => b.isCancelled === true).length;
    const inProgress = allBookings.filter(b => !b.isCompleted && !b.isCancelled).length;

    const stats = [
      { status: "Completed", count: completed },
      { status: "Cancelled", count: cancelled },
      { status: "In Progress", count: inProgress }
    ].filter(s => s.count > 0); // Ne retourner que les statuts avec des données


    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Error in getBookingStatusStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking status stats',
      error: error.message
    });
  }
};
