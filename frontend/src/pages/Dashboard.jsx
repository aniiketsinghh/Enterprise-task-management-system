// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../api/axios';

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
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 lg:px-10 py-6 bg-green-200 min-h-screen">

      {/* Top Heading */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Hii <span className="capitalize">User</span>! Try it now ..
      </h1>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        {/* Total Tasks */}
        <div
          className="bg-white p-6 rounded-xl shadow-[0_3px_10px_rgba(0,0,0,0.06)]
          hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)]
          hover:scale-[1.02] transition-all cursor-pointer"
        >
          <p className="text-gray-500 text-sm font-medium mb-1">Total Tasks</p>
          <h2 className="text-3xl font-bold text-green-600">{stats.totalTasks}</h2>
        </div>

        {/* Completed */}
        <div
          className="bg-white p-6 rounded-xl shadow-[0_3px_10px_rgba(0,0,0,0.06)]
          hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)]
          hover:scale-[1.02] transition-all cursor-pointer"
        >
          <p className="text-gray-500 text-sm font-medium mb-1">Completed Tasks</p>
          <h2 className="text-3xl font-bold text-blue-600">{stats.completedTasks}</h2>
        </div>

        {/* Pending */}
        <div
          className="bg-white p-6 rounded-xl shadow-[0_3px_10px_rgba(0,0,0,0.06)]
          hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)]
          hover:scale-[1.02] transition-all cursor-pointer"
        >
          <p className="text-gray-500 text-sm font-medium mb-1">Pending Tasks</p>
          <h2 className="text-3xl font-bold text-yellow-600">{stats.pendingTasks}</h2>
        </div>

        {/* Projects */}
        <div
          className="bg-white p-6 rounded-xl shadow-[0_3px_10px_rgba(0,0,0,0.06)]
          hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)]
          hover:scale-[1.02] transition-all cursor-pointer"
        >
          <p className="text-gray-500 text-sm font-medium mb-1">Projects</p>
          <h2 className="text-3xl font-bold text-purple-600">{stats.projects}</h2>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="bg-white rounded-xl shadow-[0_3px_10px_rgba(0,0,0,0.08)] overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>

          <Link
            to="/tasks"
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            View All
          </Link>
        </div>

        {/* Task List */}
        <div className="bg-white">
          {recentTasks.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No tasks found. Create your first task!
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentTasks.map((task) => (
                <li
                  key={task._id}
                  className="px-6 py-4 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="h-4 w-4 text-green-600 border-gray-300 rounded"
                    />

                    <div className="ml-3">
                      <p
                        className={`text-sm font-medium ${
                          task.completed
                            ? 'text-gray-400 line-through'
                            : 'text-gray-800'
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
