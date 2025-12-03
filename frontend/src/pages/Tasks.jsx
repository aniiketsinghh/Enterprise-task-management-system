// src/pages/Tasks.jsx
import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '../api/axios';
import Button from '../components/Button';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/api/tasks');
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await api.post('/api/tasks', taskData);
      setShowForm(false);
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await api.put(`/api/tasks/${taskId}`, updates);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await api.delete(`/api/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      await api.patch(`/api/tasks/${taskId}/status`, {
        completed: !currentStatus
      });
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <Button
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
          className="inline-flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Task
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <TaskForm
            initialValues={editingTask || {}}
            onSubmit={editingTask ? 
              (data) => handleUpdateTask(editingTask._id, data) : 
              handleCreateTask}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={(task) => {
            setEditingTask(task);
            setShowForm(true);
          }}
          onDelete={handleDeleteTask}
          onToggleStatus={toggleTaskStatus}
        />
      )}
    </div>
  );
};

export default Tasks;