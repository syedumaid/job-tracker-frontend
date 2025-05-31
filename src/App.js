import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EditJob from "./pages/EditJob";
import "./styles.css";

function App() {
  return (
    <Router>
      <div className="container">
        <h1>Job Application Tracker</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/edit/:id" element={<EditJob />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
