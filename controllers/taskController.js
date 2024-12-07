const Task = require('../models/Task');


exports.createTask = async (req, res, next) => {
  try {
    const taskData = req.body;
    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};


exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, sort, limit = 20, skip = 0 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .sort(sort === 'dueDate' ? { dueDate: 1 } : { createdAt: 1 })
      .skip(Number(skip))
      .limit(Number(limit));

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};


exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};


exports.updateTask = async (req, res, next) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};


exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
