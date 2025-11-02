// controllers/userController.js
import User from '../models/User.js';
import ConsultingOffer from '../models/ConsultingOffer.js';

// @desc    Get user profile by username
// @route   GET /api/users/:username
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password -email')
      .populate('consultingOffers');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Increment profile views
    user.profileViews += 1;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// @desc    Create consulting offer
// @route   POST /api/users/offers
// @access  Private
const createConsultingOffer = async (req, res) => {
  try {
    const { title, description, duration, skills, benefits, category, difficulty } = req.body;

    const offer = await ConsultingOffer.create({
      title,
      description,
      duration,
      skills,
      benefits,
      category,
      difficulty,
      createdBy: req.user.id
    });

    // Add offer to user's consulting offers
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { consultingOffers: offer._id } }
    );

    res.status(201).json(offer);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// @desc    Get all users (for discovery)
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
  try {
    const { skill, company, role, page = 1, limit = 10 } = req.query;

    let query = { isAvailable: true };

    if (skill) {
      query['skills.name'] = { $regex: skill, $options: 'i' };
    }

    if (role) {
      query.desiredRoles = { $regex: role, $options: 'i' };
    }

    const users = await User.find(query)
      .select('-password -email')
      .populate('consultingOffers')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ completedSessions: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

export {
  getUserProfile,
  updateUserProfile,
  createConsultingOffer,
  getUsers
};