// src/components/ProjectForm.jsx
import { useState, useEffect } from "react";
import Button from "./Button";
import Input from "./Input";

const ProjectForm = ({ initialValues, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    if (initialValues) {
      setFormData({
        title: initialValues.title || "",
        description: initialValues.description || "",
        status: initialValues.status || "active",
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { title, value } = e.target;
    setFormData((prev) => ({ ...prev, [title]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Project Name"
        title="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          title="description"
          rows={3}
          className="w-full px-3 py-2 border rounded-md"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          title="status"
          className="w-full px-3 py-2 border rounded-md"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="on-hold">On Hold</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialValues ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
