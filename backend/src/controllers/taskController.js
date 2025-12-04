import asyncHandler from "express-async-handler";
import Task from "../models/Task.js";
import Project from "../models/Project.js";

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, projectId, dueDate, priority, description } = req.body;

  // Check if project exists
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Check project ownership
  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to add tasks to this project");
  }

  // Create task
  const task = await Task.create({
    title,
    projectId,
    dueDate,
    priority,
    description,
    completed: false,
  });

  res.status(201).json(task);
});

// @desc    Get tasks for a project
// @route   GET /api/tasks/:projectId
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;

  // Validate project exists
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Check ownership
  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to view tasks for this project");
  }

  // Fetch tasks
  const tasks = await Task.find({ projectId });
  res.json(tasks);
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { title, completed, dueDate, priority, description } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Check ownership via project
  const project = await Project.findById(task.projectId);
  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this task");
  }

  // Update fields only if provided
  task.title = title ?? task.title;
  task.completed = completed ?? task.completed;
  task.dueDate = dueDate ?? task.dueDate;
  task.priority = priority ?? task.priority;
  task.description = description ?? task.description;

  const updatedTask = await task.save();
  res.json(updatedTask);
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  const project = await Project.findById(task.projectId);

  // Only owner can delete
  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this task");
  }

  await Task.deleteOne({ _id: task._id });

  res.json({ message: "Task removed" });
});

export { createTask, getTasks, updateTask, deleteTask };
