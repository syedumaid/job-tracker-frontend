import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobs, updateJob } from "../api";
import JobForm from "../components/JobForm";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    getJobs().then(res => {
      const target = res.data.find(j => j.id.toString() === id.toString());
      if (target) setJob(target);
      else navigate("/");
    });
  }, [id, navigate]);

  const handleUpdate = async (updatedJob) => {
    await updateJob(id, updatedJob);
    navigate("/");
  };

  return (
    <div>
      <h2>Edit Job</h2>
      {job ? (
        <JobForm onSubmit={handleUpdate} initialData={job} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default EditJob;
