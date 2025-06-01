import React, { useEffect, useState } from "react";
import ContactForm from "../components/ContactForm";
import {
  getContacts,
  addContact,
  deleteContact,
  updateContact,
  archiveContact,
} from "../api";

function NetworkingTracker() {
  const [contacts, setContacts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 10;

  const statuses = ["Message Sent", "Received Reply", "Follow Up", "Meeting Booked"];

  const statusColors = {
    "Message Sent": "#fbc02d",
    "Received Reply": "#64b5f6",
    "Follow Up": "#81c784",
    "Meeting Booked": "#9575cd",
    "All": "#007bff"
  };

  const fetchContacts = async () => {
    try {
      const res = await getContacts();
      const sorted = [...res.data].sort((a, b) => b.id - a.id);
      setContacts(sorted);
      applyFilters(sorted, statusFilter, search, sortOrder);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const applyFilters = (source = contacts, status = statusFilter, keyword = search, sort = sortOrder) => {
    let result = source.filter((c) => {
      const matchStatus = status === "All" || c.status === status;
      const matchSearch =
        c.name.toLowerCase().includes(keyword.toLowerCase()) ||
        c.company.toLowerCase().includes(keyword.toLowerCase()) ||
        c.role.toLowerCase().includes(keyword.toLowerCase());
      return matchStatus && matchSearch;
    });

    result.sort((a, b) => sort === "newest" ? b.id - a.id : a.id - b.id);
    setFiltered(result);
    setCurrentPage(1);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === "modal-overlay") {
      setShowForm(false);
      setEditingContact(null);
    }
  };

  const handleAddContact = async (newContact) => {
    try {
      const res = await addContact(newContact);
      const updated = [...contacts, res.data];
      setContacts(updated);
      applyFilters(updated);
      setShowForm(false);
    } catch (err) {
      console.error("Add contact failed:", err);
    }
  };

  const handleEditContact = async (updatedContact) => {
    try {
      await updateContact(editingContact.id, updatedContact);
      const updated = contacts.map((c) =>
        c.id === editingContact.id ? { ...c, ...updatedContact } : c
      );
      setContacts(updated);
      applyFilters(updated);
      setEditingContact(null);
    } catch (err) {
      console.error("Update contact failed:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContact(id);
      const updated = contacts.filter((c) => c.id !== id);
      setContacts(updated);
      applyFilters(updated);
    } catch (err) {
      console.error("Delete contact failed:", err);
    }
  };

  const handleArchive = async (id) => {
    try {
      await archiveContact(id);
      const updated = contacts.map((c) =>
        c.id === id ? { ...c, status: "archived" } : c
      );
      setContacts(updated);
      applyFilters(updated);
    } catch (err) {
      console.error("Archive contact failed:", err);
    }
  };

  const indexOfLast = currentPage * contactsPerPage;
  const indexOfFirst = indexOfLast - contactsPerPage;
  const currentContacts = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / contactsPerPage);

  const statusCounts = contacts.reduce((acc, contact) => {
    acc[contact.status] = (acc[contact.status] || 0) + 1;
    acc.All = (acc.All || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Status Count Badges */}
      {/* <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginBottom: "1rem" }}>
        {["All", ...statuses].map((status) => (
          <span
            key={status}
            style={{
              padding: "0.3rem 0.8rem",
              fontSize: "0.85rem",
              borderRadius: "1rem",
              backgroundColor: statusColors[status] || "#aaa",
              color: "white",
              fontWeight: "bold"
            }}
          >
            {status} {statusCounts[status] || 0}
          </span>
        ))}
      </div> */}

      {/* Filter Buttons */}
      {/* Unified Status Badges with Filter */}
<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
  {["All", ...statuses].map((status) => (
    <button
      key={status}
      onClick={() => {
        setStatusFilter(status);
        applyFilters(contacts, status, search, sortOrder);
      }}
      style={{
        padding: "0.4rem 1rem",
        borderRadius: "1rem",
        border: "none",
        fontSize: "0.9rem",
        fontWeight: "bold",
        backgroundColor: statusFilter === status ? statusColors[status] : "#e0e0e0",
        color: statusFilter === status ? "#fff" : "#000",
        cursor: "pointer",
        boxShadow: statusFilter === status ? "0 0 8px rgba(0,0,0,0.3)" : "none",
        transition: "all 0.2s ease-in-out",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}
    >
      {status} <span style={{
        backgroundColor: "#fff",
        color: statusColors[status] || "#333",
        padding: "0.15rem 0.6rem",
        borderRadius: "999px",
        fontSize: "0.8rem",
        fontWeight: "bold"
      }}>{statusCounts[status] || 0}</span>
    </button>
  ))}
</div>


      {/* Sort + Reset */}
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            applyFilters(contacts, statusFilter, search, e.target.value);
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
        <button
          onClick={() => {
            setStatusFilter("All");
            setSearch("");
            setSortOrder("newest");
            applyFilters(contacts, "All", "", "newest");
          }}
          style={{
            marginLeft: "1rem",
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

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, role or company..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          applyFilters(contacts, statusFilter, e.target.value, sortOrder);
        }}
        style={{
          width: "100%",
          maxWidth: "500px",
          margin: "0 auto 2rem",
          display: "block",
          padding: "0.75rem",
          fontSize: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      {/* Contact Grid */}
      <div className="job-list">
        {currentContacts.map((contact) => (
          <div key={contact.id} className="job-item">
            <h3>{contact.name}</h3>
            <p><strong>Platform:</strong> {contact.platform}</p>
            <p><strong>Email:</strong> {contact.email}</p>
            <p><strong>Phone:</strong> {contact.phone}</p>
            <p><strong>Company:</strong> {contact.company}</p>
            <p><strong>Role:</strong> {contact.role}</p>
            <p><strong>Status:</strong>{" "}
              <span className={`badge badge-${contact.status.replace(/\s/g, "-")}`}>
                {contact.status}
              </span>
            </p>
            <p><strong>Comments:</strong> {contact.comments}</p>
            <div className="job-actions">
              <button onClick={() => setEditingContact(contact)}>Edit</button>
              <button onClick={() => handleDelete(contact.id)}>Delete</button>
              <button onClick={() => handleArchive(contact.id)}>Archive</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>Prev</button>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>Next</button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setShowForm(true)}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#8f7300",
          color: "white",
          fontSize: "2rem",
          border: "none",
          cursor: "pointer",
          zIndex: 999
        }}
        title="Add Contact"
      >
        ＋
      </button>

      {/* Modal */}
      {(showForm || editingContact) && (
        <div className="modal-overlay" onClick={handleOverlayClick} style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "2rem", borderRadius: "10px",
            maxWidth: "500px", width: "100%", position: "relative"
          }}>
            <button onClick={() => {
              setShowForm(false);
              setEditingContact(null);
            }} style={{
              position: "absolute", top: 10, right: 15, border: "none", fontSize: "1.5rem", background: "none"
            }}>✖</button>
            <h2 style={{ textAlign: "center" }}>{editingContact ? "Edit Contact" : "Add Contact"}</h2>
            <ContactForm
              initialData={editingContact}
              onSubmit={(data) => {
                editingContact ? handleEditContact(data) : handleAddContact(data);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default NetworkingTracker;
