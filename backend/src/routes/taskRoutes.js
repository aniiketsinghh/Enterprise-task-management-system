import express from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

router.route('/').post(verifyJWT, createTask);
router.route('/:projectId').get(verifyJWT, getTasks);
router.route('/:id').put(verifyJWT, updateTask).delete(verifyJWT, deleteTask);

export default router;
