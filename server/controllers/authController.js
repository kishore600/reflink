// controllers/authController.js
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password, name, title, experience, location } = req.body;

    // Check if user exists
    const userExists = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists with this email or username'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      name,
      title,
      experience,
      location
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        title: user.title,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        title: user.title,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('consultingOffers');

    res.json(user);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

export {
  registerUser,
  loginUser,
  getMe
};