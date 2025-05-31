import React, { useState } from "react";

// function JobForm({ onSubmit, initialData = null }) {
//   const [form, setForm] = useState(
//     initialData || {
//       company: "",
//       title: "",
//       status: "Applied",
//       salary: "",
//       description: "",
//       tags: ""
//     }
//   );
function JobForm({ onSubmit, initialData = null }) {
    const [form, setForm] = useState(
      initialData || {
        company: "",
        title: "",
        status: "Applied",
        salary: "",
        description: "",
        tags: ""
      }
    );
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.company && form.title) {
      onSubmit(form);
      if (!initialData) {
        setForm({
          company: "",
          title: "",
          status: "Applied",
          salary: "",
          description: "",
          tags: ""
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="company"
        placeholder="Company"
        value={form.company}
        onChange={handleChange}
        required
      />
      <input
        name="title"
        placeholder="Job Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        name="salary"
        placeholder="Salary (e.g., 100k-120k)"
        value={form.salary}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Short description (e.g., Frontend React role)"
        value={form.description}
        onChange={handleChange}
        rows={3}
        style={{ resize: "none", padding: "0.75rem", borderRadius: "6px" }}
      />
      <input
        name="tags"
        placeholder="Tags (comma separated, e.g., remote, urgent)"
        value={form.tags}
        onChange={handleChange}
      />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="Applied">Applied</option>
        <option value="Interviewing">Interviewing</option>
        <option value="Offered">Offered</option>
        <option value="Rejected">Rejected</option>
        <option value="Archived">Archived</option>
      </select>
      <button type="submit">{initialData ? "Update" : "Add Job"}</button>
    </form>
  );
}

export default JobForm;
