// src/pages/Projects.jsx
import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";
import api from "../api/axios";
import Button from "../components/Button";
import ProjectForm from "../components/ProjectForm";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/projects");
      setProjects(response.data.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
    setLoading(false);
  };

  const handleCreateProject = async (data) => {
    try {
      await api.post("/api/projects", data);
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  const handleUpdateProject = async (id, data) => {
    try {
      await api.put(`/api/projects/${id}`, data);
      setShowForm(false);
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Do you want to delete this project?")) return;

    try {
      await api.delete(`/api/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-200 text-gray-700",
      "on-hold": "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes[status]}`}>
        {status.replace("-", " ").toUpperCase()}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>

        <Button
          onClick={() => {
            setEditingProject(null);
            setShowForm(true);
          }}
          className="flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Project
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">
            {editingProject ? "Edit Project" : "Create New Project"}
          </h2>

          <ProjectForm
            initialValues={editingProject}
            onSubmit={(data) =>
              editingProject
                ? handleUpdateProject(editingProject._id, data)
                : handleCreateProject(data)
            }
            onCancel={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
          />
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">{project.name}</h3>

                <div className="flex space-x-2">
                  {/* Edit Button */}
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setShowForm(true);
                    }}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    ✏️
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {project.description && (
                <p className="mt-2 text-sm text-gray-600">
                  {project.description}
                </p>
              )}

              <div className="mt-4 flex justify-between items-center">
                {getStatusBadge(project.status)}

                <Link
                  to={`/projects/${project._id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
