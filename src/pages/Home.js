import React, { useEffect, useState } from "react";
import { getJobs, addJob, deleteJob, archiveJob } from "../api";
import JobItem from "../components/JobItem";
import JobForm from "../components/JobForm";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [toast, setToast] = useState(null);
  const jobsPerPage = 10;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await getJobs();
    setJobs(res.data);
    filterJobs(res.data);
  };

  const filterJobs = (jobList = jobs) => {
    const filtered = jobList.filter((job) => {
      const matchesKeyword =
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || job.status === statusFilter;
      const matchesTag =
        tagFilter === "" ||
        (job.tags && job.tags.toLowerCase().includes(tagFilter.toLowerCase()));
      return matchesKeyword && matchesStatus && matchesTag;
    });

    const sorted = [...filtered].sort((a, b) => {
      return sortOrder === "newest"
        ? parseInt(b.id) - parseInt(a.id)
        : parseInt(a.id) - parseInt(b.id);
    });

    setFilteredJobs(sorted);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterJobs();
  }, [search, tagFilter, statusFilter, sortOrder]);

  const handleAddJob = async (job) => {
    await addJob(job);
    fetchJobs();
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    await deleteJob(id);
    fetchJobs();
  };

  const handleArchive = async (id) => {
    await archiveJob(id);
    fetchJobs();
  };

  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    acc.All = (acc.All || 0) + 1;
    return acc;
  }, {});

  const getColor = (status) => {
    switch (status) {
      case "Applied": return "#007bff";
      case "Interviewing": return "#17a2b8";
      case "Offered": return "#28a745";
      case "Rejected": return "#dc3545";
      case "Archived": return "#6c757d";
      default: return "#007bff";
    }
  };

  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handleOverlayClick = (e) => {
    if (e.target.className === "modal-overlay") {
      setShowForm(false);
      setEditingJob(null);
    }
  };

  return (
    <div>
      {/* Status Counters */}
      {/* Unified Status Counter + Filter */}
<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
  {["All", "Applied", "Interviewing", "Offered", "Rejected", "Archived"].map((status) => (
    <button
      key={status}
      onClick={() => setStatusFilter(status)}
      style={{
        padding: "0.4rem 1rem",
        borderRadius: "1rem",
        border: "none",
        fontSize: "0.9rem",
        fontWeight: "bold",
        backgroundColor: statusFilter === status ? getColor(status) : "#e0e0e0",
        color: statusFilter === status ? "#fff" : "#000",
        cursor: "pointer",
        boxShadow: statusFilter === status ? "0 0 8px rgba(0,0,0,0.3)" : "none",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        transition: "all 0.2s ease-in-out"
      }}
    >
      {status} <span style={{
        backgroundColor: "#fff",
        color: getColor(status),
        padding: "0.15rem 0.6rem",
        borderRadius: "999px",
        fontSize: "0.8rem",
        fontWeight: "bold"
      }}>{statusCounts[status] || 0}</span>
    </button>
  ))}
</div>


      {/* Filter Buttons */}
      {/* <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.5rem", marginTop: "2rem" }}>
        {["All", "Applied", "Interviewing", "Offered", "Rejected", "Archived"].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "20px",
              fontWeight: "600",
              backgroundColor: statusFilter === status ? getColor(status) : "#e0e0e0",
              color: statusFilter === status ? "white" : "#333",
              border: "none",
              cursor: "pointer"
            }}
          >
            {status}
          </button>
        ))}
      </div> */}

      {/* Sort & Reset */}
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            padding: "0.5rem",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            maxWidth: "200px"
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setTagFilter("");
            setStatusFilter("All");
          }}
          style={{
            marginLeft: "1rem",
            padding: "0.5rem 1rem",
            fontWeight: "bold",
            border: "1px solid #007bff",
            background: "#fff",
            color: "#007bff",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Reset Filters
        </button>
      </div>

      {/* Search Inputs */}
      <input
        type="text"
        placeholder="Search by company or title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%", maxWidth: "500px", margin: "2rem auto 0",
          display: "block", padding: "0.75rem", fontSize: "1rem", borderRadius: "6px", border: "1px solid #ccc"
        }}
      />
      <input
        type="text"
        placeholder="Filter by tag (e.g., remote, urgent)..."
        value={tagFilter}
        onChange={(e) => setTagFilter(e.target.value)}
        style={{
          width: "100%", maxWidth: "500px", margin: "1rem auto 2rem",
          display: "block", padding: "0.75rem", fontSize: "1rem", borderRadius: "6px", border: "1px solid #ccc"
        }}
      />

      {/* Job Cards */}
      <div className="job-list">
        {currentJobs.map((job) => (
          <JobItem
            key={job.id}
            job={job}
            onDelete={handleDelete}
            onArchive={handleArchive}
            onEdit={() => setEditingJob(job)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>Prev</button>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>Next</button>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setShowForm(true)}
        style={{
          position: "fixed", bottom: "2rem", right: "2rem",
          width: "60px", height: "60px", borderRadius: "50%",
          // backgroundColor: "#007bff", 
          color: "#fff", fontSize: "2rem",
          border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 999
        }}
      >＋</button>

      {/* Modal */}
      {(showForm || editingJob) && (
        <div className="modal-overlay" onClick={handleOverlayClick} style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "2rem", borderRadius: "10px",
            maxWidth: "500px", width: "100%", position: "relative"
          }}>
            <button onClick={() => {
              setShowForm(false);
              setEditingJob(null);
            }} style={{
              position: "absolute", top: 10, right: 15, border: "none", fontSize: "1.5rem", background: "none"
            }}>✖</button>
            <h2 style={{ textAlign: "center" }}>{editingJob ? "Edit Job" : "Add Job"}</h2>
            <JobForm
              initialData={editingJob}
              onSubmit={async (job) => {
                if (editingJob) {
                  await deleteJob(editingJob.id);
                  await addJob({ ...job, id: editingJob.id });
                } else {
                  await addJob(job);
                }
                fetchJobs();
                setShowForm(false);
                setEditingJob(null);
                setToast("Job saved successfully!");
                setTimeout(() => setToast(null), 3000);
              }}
            />
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
          backgroundColor: "#333", color: "#fff", padding: "1rem 2rem", borderRadius: "8px",
          zIndex: 2000
        }}>{toast}</div>
      )}
    </div>
  );
}

export default Home;
