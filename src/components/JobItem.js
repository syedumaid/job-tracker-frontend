import React from "react";
import { useNavigate } from "react-router-dom";

function JobItem({ job, onEdit, onDelete, onArchive }) {
  const navigate = useNavigate();

  const statusColor = {
    Applied: "status-applied",
    Interviewing: "status-interviewing",
    Offered: "status-offered",
    Rejected: "status-rejected",
    Archived: "status-archived",
  };

  const cardColor = {
    Applied: "",
    Interviewing: "green",
    Offered: "green",
    Rejected: "red",
    Archived: "gray",
  };

  return (
    <div className={`job-item ${cardColor[job.status] || ""}`}>
      <div>
        <strong>{job.title}</strong> <br />
        <em>{job.company}</em>
        <div className={`status-badge ${statusColor[job.status]}`}>
          {job.status}
        </div>

        {job.salary && (
          <div style={{ marginTop: "0.5rem" }}>$ {job.salary}</div>
        )}
        {job.description && (
          <div style={{ marginTop: "0.5rem" }}>{job.description}</div>
        )}
        {job.tags && (
          <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#555" }}>
             <i>{job.tags.split(',').map(tag => tag.trim()).join(' | ')}</i>
          </div>
        )}
      </div>

      <div className="job-actions">
        {/* <button onClick={() => navigate(`/edit/${job.id}`)}>✏️ Edit</button> */}
        <button onClick={() => onEdit(job)}>Edit</button>

        <button onClick={() => onDelete(job.id)}>Delete</button>
        {job.status !== "Archived" && (
          <button onClick={() => onArchive(job.id)}>Archive</button>
        )}
      </div>
    </div>
  );
}

export default JobItem;
