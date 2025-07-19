import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import "./styles/Dashboard.css";

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [statusCounts, setStatusCounts] = useState({ pending: 0, accepted: 0, rejected: 0 });
  const [statusFilter, setStatusFilter] = useState(null);
  const [statusName, setStatusName] = useState("All Applications");
  const [adminName, setAdminName] = useState("Admin"); // fallback

    const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

const fetchData = async () => {
  try {
    const res = await fetch(
      `http://localhost/StudentAdmission/back-end/fetchDashboard.php${statusFilter ? "?status=" + statusFilter : ""}`,
      {
       method: "GET",
        credentials: "include"  // VERY important to include cookies
      }
    );

    if (res.status === 401) {
      localStorage.clear(); // Clear old data
      window.location.href = "/login";
      return;
    }

    const data = await res.json();

    setApplications(data.applications);
    setStatusCounts(data.status_counts);
    setStatusName(data.status_name);
    setAdminName(data.adminName); // ← Use session-based name instead of localStorage
  } catch (err) {
    console.error("Fetch error:", err);
  }
};



  const handleFilter = (status) => {
    setStatusFilter(status);
  };

  return (
    <div className="page-container">
  <div className="navbar">
        <div className="hamburger" onClick={toggleSidebar}>☰</div>
<div className="profile-dropdown" onClick={toggleProfileDropdown}>
  <span>👤 {adminName}</span>
  {showProfileDropdown && (
    <div className="dropdown-menu">
      <button
        type="button"
        onClick={() => {
          fetch("http://localhost/StudentAdmission/back-end/logout.php", {
            method: "POST",
            credentials: "include", // Make sure cookies/sessions are sent
          })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                localStorage.clear();
                window.location.href = "/login";
              } else {
                console.error("Logout failed:", data);
              }
            })
            .catch(err => {
              console.error("Logout error:", err);
            });
        }}
      >
        Logout
      </button>
    </div>
  )}
</div>

      </div>


  <div className={`sidebar ${isSidebarOpen ? "" : "hidden"}`}>
        <h2>🏛 ADMISSIONS</h2>
        <a href="/Home">🏠 Dashboard</a>
        <a href="/course">📚 Course Management</a>
      </div>


     <div className={`main ${isSidebarOpen ? "" : "full"}`}>
        <div className="header">
          <h1>Dashboard</h1>
          <div className="filters">
            <button onClick={() => handleFilter(null)}>📋 All</button>
            <button onClick={() => handleFilter(1)}>🟡 Pending</button>
            <button onClick={() => handleFilter(2)}>✅ Accepted</button>
            <button onClick={() => handleFilter(3)}>❌ Rejected</button>
          </div>
        </div>

        <div className="status-cards">
          <div className="card"><h3>Pending</h3><div className="count">{statusCounts.pending}</div></div>
          <div className="card"><h3>Accepted</h3><div className="count">{statusCounts.accepted}</div></div>
          <div className="card"><h3>Rejected</h3><div className="count">{statusCounts.rejected}</div></div>
        </div>

        <div className="table-container">
          <h2>{statusName}</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Email</th><th>Course</th><th>Status</th><th>Date</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map(app => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>{app.first_name} {app.last_name}</td>
                    <td>{app.email}</td>
                    <td>{app.course}</td>
                    <td>
                      {app.status === "1" && <span className="status-badge pending">Pending</span>}
                      {app.status === "2" && <span className="status-badge accepted">Accepted</span>}
                      {app.status === "3" && <span className="status-badge rejected">Rejected</span>}
                    </td>
                    <td>{new Date(app.created_at).toLocaleDateString()}</td>
                    <td>
                    <Link to={`/view/${app.id}`}>
  <button className="action-btn">View</button>
</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7">No applications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
