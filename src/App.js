import "./styles.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import NetworkingTracker from "./pages/NetworkingTracker";

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-left">
            <Link to="/" className="nav-link">Job Tracker</Link>
            <Link to="/networking" className="nav-link">Networking Tracker</Link>
          </div>
          <div className="nav-right">
            <button onClick={toggleTheme} className="theme-toggle">
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/networking" element={<NetworkingTracker />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
