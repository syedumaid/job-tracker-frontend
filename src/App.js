import "./styles.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

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
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>

        <Routes>
          <Route path="/" element={<Home />} />
          
        </Routes>
      </div>
    </Router>
  );
}
// function App() {
//   const [theme, setTheme] = useState("light");

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme") || "light";
//     setTheme(savedTheme);
//     document.documentElement.setAttribute("data-theme", savedTheme);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//     document.documentElement.setAttribute("data-theme", newTheme);
//     localStorage.setItem("theme", newTheme);
//   };

//   return (
//     <div className="App">
//       <button onClick={toggleTheme} className="theme-toggle">
//         {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
//       </button>
//       {/* Your Routes and pages */}
//       <Router>
//        <div className="container">
//          <h1>Job Application Tracker</h1>
//          <Routes>
//            <Route path="/" element={<Home />} />
//            {/* <Route path="/edit/:id" element={<EditJob />} /> */}
//          </Routes>
//        </div>
//      </Router>
//     </div>
//   );
  // return (
  //   <Router>
  //     <div className="container">
  //       <h1>Job Application Tracker</h1>
  //       <Routes>
  //         <Route path="/" element={<Home />} />
  //         {/* <Route path="/edit/:id" element={<EditJob />} /> */}
  //       </Routes>
  //     </div>
  //   </Router>
  // );
// }

export default App;
