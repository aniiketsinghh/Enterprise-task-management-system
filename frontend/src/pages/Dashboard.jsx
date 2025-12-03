// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../api/axios';
import Card from '../components/Card';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    projects: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          api.get('/api/dashboard/stats'),
          api.get('/api/tasks?limit=5'),
        ]);
        
        setStats(statsRes.data);
        setRecentTasks(tasksRes.data.tasks || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalTasks}
          </p>
        </Card>
        <Card className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            {stats.completedTasks}
          </p>
        </Card>
        <Card className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="mt-2 text-3xl font-semibold text-yellow-600">
            {stats.pendingTasks}
          </p>
        </Card>
        <Card className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Projects</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">
            {stats.projects}
          </p>
        </Card>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Tasks</h2>
          <Link
            to="/tasks"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </div>
        <div className="bg-white overflow-hidden">
          {recentTasks.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No tasks found. Create your first task to get started.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentTasks.map((task) => (
                <li key={task._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <p
                        className={`text-sm font-medium ${
                          task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.dueDate && (
                        <p className="text-xs text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;