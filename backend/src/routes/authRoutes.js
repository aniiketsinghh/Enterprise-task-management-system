import express from 'express';
import {
  signup,
  login,
  googleLoginURL,
  googleCallback,
  refreshAccessToken,
  logout,
  getMe,
} from '../controllers/authController.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me',verifyJWT, getMe);
router.get('/google/url', googleLoginURL);
router.get('/google/callback', googleCallback);
router.get('/refresh', refreshAccessToken);
router.post('/logout', logout);

export default router;
