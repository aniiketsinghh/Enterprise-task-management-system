import express from 'express';
import {
  signup,
  login,
  googleLoginURL,
  googleCallback,
  refreshAccessToken,
  logout,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/google/url', googleLoginURL);
router.get('/google/callback', googleCallback);
router.get('/refresh', refreshAccessToken);
router.post('/logout', logout);

export default router;
