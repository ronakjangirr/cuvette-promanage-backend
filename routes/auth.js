const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const authMiddleware = require('../middlewares/authMiddleware');

const errorHandler = (res, error) => {
  console.error(error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
  // Add a return statement to prevent further execution
  return;
};


// Register User Api
router.post('/register', async (req, res) => {
  try {
    let { name, email, password, confirmPassword } = req.body;
    console.log(name, email, password, confirmPassword);
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
      });
    }

    // const existingUser = await User.findOne({ email });
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email is already registered',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({ name, email, password: hashedPassword, confirmPassword: hashedPassword });
    await user.save();

    const token = jwt.sign({ user: user.name }, process.env.SECRET_KEY);

    res.json({
      success: true,
      user: user.name,
      token: token,
    });
  } catch (error) {
    errorHandler(res, error);
  }
});


// Login User Api

router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    
    console.log(email, password);
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        error: 'Password not matched',
      });
    }

    const token = jwt.sign({ userId: existingUser._id }, process.env.SECRET_KEY);

    res.json({
      success: true,
      name: existingUser.name, // Include the name property in the response

      // email: existingUser.email,
      token: token,
    });
  } catch (error) {
    errorHandler(res, error);
  }
});
























// Fetch Current User Information Endpoint
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from JWT token middleware
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
      },
    });
  } catch (error) {
    errorHandler(res, error);
  }
});








// Update User Name and Password Endpoint
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { name, oldPassword, newPassword } = req.body;
    const userId = req.user.userId; // Extracted from JWT token middleware

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if the old password matches the one stored in the database
    const matchPassword = await bcrypt.compare(oldPassword, user.password);
    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        error: 'Old password does not match',
      });
    }

    // Update user's name if provided
    if (name) {
      user.name = name;
    }

    // Update user's password if provided
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
    }

    // Save the updated user object
    await user.save();

    res.json({
      success: true,
      message: 'User information updated successfully',
    });
  } catch (error) {
    errorHandler(res, error);
  }
});



module.exports = router;


