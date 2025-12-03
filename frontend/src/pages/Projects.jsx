// src/pages/Projects.jsx
import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router';
import api from '../api/axios';
import Button from '../components/Button';
import ProjectForm from '../components/ProjectForm';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/api/projects');
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      await api.post('/api/projects', projectData);
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async (projectId, updates) => {
    try {
      await api.put(`/api/projects/${projectId}`, updates);
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await api.delete(`/api/projects/${projectId}`);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Button
          onClick={() => {
            setEditingProject(null);
            setShowForm(true);
          }}
          className="inline-flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Project
        </Button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingProject ? 'Edit Project' : 'Create New Project'}
          </h2>
          <ProjectForm
            initialValues={editingProject || {}}
            onSubmit={editingProject ? 
              (data) => handleUpdateProject(editingProject._id, data) : 
              handleCreateProject}
            onCancel={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">
                    {project.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingProject(project)}
                      className="text-gray-400 hover:text-blue-600"
                      title="Edit"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                {project.description && (
                  <p className="mt-2 text-sm text-gray-500">
                    {project.description}
                  </p>
                )}
                <div className="mt-4 flex justify-between items-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {project.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                  <Link
                    to={`/projects/${project._id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;