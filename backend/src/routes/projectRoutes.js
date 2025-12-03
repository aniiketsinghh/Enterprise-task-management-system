import express from 'express';
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

router.route('/').post(verifyJWT, createProject).get(verifyJWT, getProjects);
router.route('/:id').put(verifyJWT, updateProject).delete(verifyJWT, deleteProject);

export default router;
