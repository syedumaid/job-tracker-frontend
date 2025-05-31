import React, { useEffect, useState } from "react";
import { getJobs, addJob, deleteJob, archiveJob } from "../api";
import JobItem from "../components/JobItem";
import JobForm from "../components/JobForm";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [tagFilter, setTagFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const jobsPerPage = 6;
  const [editingJob, setEditingJob] = useState(null);
  const [toast, setToast] = useState(null);


  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    acc.All = (acc.All || 0) + 1;
    return acc;
  }, {});

  const resetFilters = () => {
    setSearch("");
    setTagFilter("");
    setStatusFilter("All");
    setFilteredJobs(applySort(jobs));
    setCurrentPage(1);
  };

  const fetchJobs = async () => {
    const res = await getJobs();
    setJobs(res.data);
    setFilteredJobs(applySort(res.data));
  };

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

  const applySort = (jobList) => {
    const sorted = [...jobList].sort((a, b) => {
      if (sortOrder === "newest") {
        return parseInt(b.id) - parseInt(a.id);
      } else {
        return parseInt(a.id) - parseInt(b.id);
      }
    });
    return sorted;
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);

    const filtered = jobs.filter((job) => {
      const matchesKeyword =
        job.company.toLowerCase().includes(keyword) ||
        job.title.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;

      const matchesTag =
        tagFilter === "" ||
        (job.tags && job.tags.toLowerCase().includes(tagFilter.toLowerCase()));

      return matchesKeyword && matchesStatus && matchesTag;
    });

    setFilteredJobs(applySort(filtered));
    setCurrentPage(1);
  };

  const filterByStatus = (status) => {
    setStatusFilter(status);

    const filtered = jobs.filter((job) => {
      const matchesKeyword =
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.title.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "All" || job.status === status;

      const matchesTag =
        tagFilter === "" ||
        (job.tags && job.tags.toLowerCase().includes(tagFilter.toLowerCase()));

      return matchesKeyword && matchesStatus && matchesTag;
    });

    setFilteredJobs(applySort(filtered));
    setCurrentPage(1);
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const getColor = (status) => {
    switch (status) {
      case "Applied":
        return "#007bff";
      case "Interviewing":
        return "#17a2b8";
      case "Offered":
        return "#28a745";
      case "Rejected":
        return "#dc3545";
      case "Archived":
        return "#6c757d";
      default:
        return "#007bff";
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      {/* Status Badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginBottom: "1rem" }}>
        {["All", "Applied", "Interviewing", "Offered", "Rejected", "Archived"].map((status) => (
          <span
            key={status}
            style={{
              padding: "0.3rem 0.8rem",
              fontSize: "0.85rem",
              borderRadius: "1rem",
              backgroundColor: getColor(status),
              color: "white",
              fontWeight: "bold"
            }}
          >
            {status} {statusCounts[status] || 0}
          </span>
        ))}
      </div>

      {/* Form shown only if toggled */}
      {showForm && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  }}>
    <div style={{
      backgroundColor: "#fff",
      padding: "2rem",
      borderRadius: "12px",
      width: "90%",
      maxWidth: "600px",
      position: "relative",
      boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
    }}>
      <button
        onClick={() => setShowForm(false)}
        style={{
          position: "absolute",
          top: "10px",
          right: "15px",
          fontSize: "1.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#333"
        }}
        title="Close"
      >
        ✖
      </button>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Add New Job</h2>
      <JobForm onSubmit={(job) => {
        handleAddJob(job);
        setShowForm(false);
      }} />
    </div>
  </div>
)}


      {/* Filter Buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginTop: "2rem" }}>
        {["All", "Applied", "Interviewing", "Offered", "Rejected", "Archived"].map((status) => (
          <button
            key={status}
            onClick={() => filterByStatus(status)}
            style={{
              padding: "0.4rem 1rem",
              fontSize: "0.9rem",
              borderRadius: "20px",
              border: "none",
              backgroundColor: statusFilter === status ? getColor(status) : "#e0e0e0",
              color: statusFilter === status ? "white" : "#333",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setFilteredJobs(applySort(filteredJobs));
          }}
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
      </div>

      {/* Reset Button */}
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <button
          onClick={resetFilters}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid #007bff",
            backgroundColor: "#ffffff",
            color: "#007bff",
            cursor: "pointer",
            fontWeight: "bold"
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
        onChange={handleSearch}
        style={{
          width: "100%",
          maxWidth: "500px",
          margin: "2rem auto 0",
          display: "block",
          padding: "0.75rem",
          fontSize: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      <input
        type="text"
        placeholder="Filter by tag (e.g., remote, urgent)..."
        value={tagFilter}
        onChange={(e) => {
          const newTag = e.target.value;
          setTagFilter(newTag);

          const filtered = jobs.filter((job) => {
            const matchesKeyword =
              job.company.toLowerCase().includes(search.toLowerCase()) ||
              job.title.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = statusFilter === "All" || job.status === statusFilter;

            const matchesTag =
              newTag === "" ||
              (job.tags && job.tags.toLowerCase().includes(newTag.toLowerCase()));

            return matchesKeyword && matchesStatus && matchesTag;
          });

          setFilteredJobs(applySort(filtered));
          setCurrentPage(1);
        }}
        style={{
          width: "100%",
          maxWidth: "500px",
          margin: "1rem auto 2rem",
          display: "block",
          padding: "0.75rem",
          fontSize: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      {/* Job List */}
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
          <button
            onClick={goToPrev}
            disabled={currentPage === 1}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: currentPage === 1 ? "#eee" : "#007bff",
              color: currentPage === 1 ? "#999" : "white",
              cursor: currentPage === 1 ? "default" : "pointer"
            }}
          >
            Prev
          </button>

          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: currentPage === totalPages ? "#eee" : "#007bff",
              color: currentPage === totalPages ? "#999" : "white",
              cursor: currentPage === totalPages ? "default" : "pointer"
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => setShowForm((prev) => !prev)}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#007bff",
          color: "white",
          fontSize: "2rem",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 999
        }}
        title={showForm ? "Close Form" : "Add Job"}
      >
        {showForm ? "✖" : "＋"}
      </button>
      {editingJob && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.3s ease"
  }}>
    <div style={{
      backgroundColor: "#fff",
      padding: "2rem",
      borderRadius: "12px",
      width: "90%",
      maxWidth: "600px",
      position: "relative",
      boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
      animation: "scaleUp 0.3s ease"
    }}>
      <button
        onClick={() => setEditingJob(null)}
        style={{
          position: "absolute",
          top: "10px",
          right: "15px",
          fontSize: "1.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#333"
        }}
        title="Close"
      >
        ✖
      </button>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Edit Job</h2>
      {/* <JobForm
        initialData={editingJob}
        onSubmit={async (updatedJob) => {
          const updatedList = jobs.map((job) =>
            job.id === editingJob.id ? { ...job, ...updatedJob } : job
          );
          setJobs(updatedList);
          setFilteredJobs(applySort(updatedList));
          setEditingJob(null);

          // If using API:
          await deleteJob(editingJob.id); // remove old
          await addJob({ ...updatedJob, id: editingJob.id }); // add updated
        }}
      /> */}
      <JobForm
  initialData={editingJob}
  onSubmit={async (updatedJob) => {
    const updatedList = jobs.map((job) =>
      job.id === editingJob.id ? { ...job, ...updatedJob } : job
    );
    setJobs(updatedList);
    setFilteredJobs(applySort(updatedList));
    setEditingJob(null);

    await deleteJob(editingJob.id);
    await addJob({ ...updatedJob, id: editingJob.id });

    setToast("Job updated successfully!");

    setTimeout(() => setToast(null), 3000);
  }}
/>

    </div>
  </div>
)}
{toast && (
  <div style={{
    position: "fixed",
    bottom: "2rem",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#333",
    color: "#fff",
    padding: "1rem 2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    zIndex: 2000,
    animation: "fadeIn 0.3s ease"
  }}>
    {toast}
  </div>
)}

    </div>
  );
}

export default Home;
