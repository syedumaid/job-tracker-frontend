import React, { useState, useEffect } from "react";

function ContactForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    platform: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    status: "",
    comments: ""
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      {["name", "platform", "email", "phone", "company", "role", "comments",].map((field) => (
        <input
          key={field}
          type="text"
          name={field}
          placeholder={field[0].toUpperCase() + field.slice(1)}
          value={formData[field]}
          onChange={handleChange}
        />
      ))}

      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="">Contact Status</option>
        <option value="message sent">Message Sent</option>
        <option value="received reply">Received Reply</option>
        <option value="follow up">Follow Up</option>
        <option value="meeting booked">Meeting Booked</option>
      </select>
      

      <button type="submit">{initialData ? "Update Contact" : "Add Contact"}</button>
    </form>
  );
}

export default ContactForm;
