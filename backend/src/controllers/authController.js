import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import client from '../config/google.js';
import sendCookieResponse from '../utils/sendCookieResponse.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    sendCookieResponse(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    sendCookieResponse(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get Google login URL
// @route   GET /api/auth/google/url
// @access  Public
const googleLoginURL = (req, res) => {
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  });
  res.json({ url });
};

// @desc    Process Google login callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;

  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub: googleId, name, email, picture: profileImage } = payload;

  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    // If user exists but signed up with email/password, update googleId
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }
    sendCookieResponse(res, user._id);
    res.redirect(process.env.CLIENT_URL);
  } else {
    // Create new user
    user = await User.create({
      name,
      email,
      googleId,
      profileImage,
    });
    if (user) {
      sendCookieResponse(res, user._id);
      res.redirect(process.env.CLIENT_URL);
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  }
});

// @desc    Refresh Access Token
// @route   GET /api/auth/refresh
// @access  Public
const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401);
    throw new Error('Not authorized, no refresh token');
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    sendCookieResponse(res, user._id);
    res.json({ message: 'Access token refreshed' });
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, invalid refresh token');
  }
});

// @desc    Logout user & clear cookies
// @route   POST /api/auth/logout
// @access  Public
const logout = (req, res) => {
  res.cookie('accessToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export { signup, login, googleLoginURL, googleCallback, refreshAccessToken, logout };
