// import React from "react";
// import { Link, useLocation } from "react-router-dom";

// const Navbar = ({ toggleTheme, theme }) => {
//   const location = useLocation();

//   return (
//     <nav className="navbar">
//       <div className="nav-left">
//         {location.pathname === "/networking" ? (
//           <Link to="/" className="nav-link">📋 Job Tracker</Link>
//         ) : (
//           <Link to="/networking" className="nav-link">📇 Networking Tracker</Link>
//         )}
//       </div>
//       <div className="nav-right">
//         <button onClick={toggleTheme} className="theme-toggle">
//           {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
// src/components/Navbar.js
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar({ toggleTheme, theme }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isJobTracker = location.pathname === "/";

  return (
    <div className="navbar">
      <div className="nav-left">
        <button
          className="nav-link"
          onClick={() => navigate(isJobTracker ? "/networking" : "/")}
        >
          {isJobTracker ? "→ Networking Tracker" : "← Job Tracker"}
        </button>
      </div>
      <div className="nav-right">
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>
    </div>
  );
}

export default Navbar;
