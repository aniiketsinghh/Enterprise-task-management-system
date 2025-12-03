import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

router.route('/profile').get(verifyJWT, getProfile).put(verifyJWT, updateProfile);

export default router;
