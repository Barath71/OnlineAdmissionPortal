import { useEffect, useState } from "react";
import './styles/Course.css';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [editCourse, setEditCourse] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState({ course: "", description: "", duration: "" });
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [adminName, setAdminName] = useState("Admin"); // fallback

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

useEffect(() => {
  fetch("http://localhost/StudentAdmission/back-end/selectCourse.php", {
    credentials: "include", // ✅ Needed to send session cookie
  })
    .then((res) => {
      if (res.status === 401) {
        localStorage.clear();
        window.location.href = "/login"; 
        return null;
      }
      return res.json();
    })
    .then((data) => {
      if (data) {
        setCourses(data.courses);
        setAdminName(data.adminName); // ✅ Set name to show at top
      }
    })
    .catch((err) => console.error("Error:", err));
}, []);


const toggleStatus = (id, currentStatus) => {
  const newStatus = currentStatus === 0 ? 1 : 0;
  setUpdatingId(id);

  fetch("http://localhost/StudentAdmission/back-end/toggleStatus.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `id=${id}&active_status=${newStatus}`,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network or server error");
      }
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        console.log("Status updated:", data.message);
        fetchCourses(); // Refresh UI
      } else {
        throw new Error(data.message);
      }
    })
    .catch((err) => {
      console.error("Status update error:", err);
      alert("Failed to update status: " + err.message);
    })
    .finally(() => setUpdatingId(null));
};


const fetchCourses = () => {
  fetch("http://localhost/StudentAdmission/back-end/selectCourse.php", {
    credentials: "include", // ⬅️ Important to send session cookie
  })
    .then((res) => {
      if (res.status === 401) {
        // Unauthorized → redirect to login
        window.location.href = "/login";
        return null;
      }
      return res.json();
    })
    .then((data) => {
      if (data) {
        setCourses(data.courses);    
        setAdminName(data.adminName); 
      }
    })
    .catch((err) => console.error("Error loading courses:", err));
};



const handleAddCourse = (e) => {
  e.preventDefault();

  // Validate form data
  if (!form.course || !form.description || !form.duration) {
    alert("All fields are required.");
    return;
  }

  fetch("http://localhost/StudentAdmission/back-end/addCourse.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form)
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Server Response:", data);
      if (data.success) {
        alert("Course added!");
        setShowAddModal(false);
        setForm({ course: "", description: "", duration: "" });
        fetchCourses(); // optional chaining in case fetchCourses is undefined
      } else {
        alert("Failed to add course: " + (data.message || data.error));
      }
    })
    .catch((err) => {
      console.error("Add course error:", err);
      alert("An error occurred while adding the course.");
    });
};



const handleEditSubmit = (e) => {
  e.preventDefault();
  fetch("http://localhost/StudentAdmission/back-end/updateCourse.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: editCourse.id, ...form })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(data.message);
        setShowEditModal(false);
        fetchCourses(); // Refresh updated data
      } else {
        alert("Update failed: " + data.message);
      }
    })
    .catch(err => console.error("Error updating course:", err));
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
        <a href="/Course">📚 Course Management</a>
      </div>


        <div className={`main ${isSidebarOpen ? "" : "full"}`}>
        <div className="header">
          <h1>Courses</h1>
          <button onClick={() => setShowAddModal(true)}>+ Add Course</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Course</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td>
                  <button onClick={() => {
                    setEditCourse(course);
                    setForm(course);
                    setShowEditModal(true);
                  }}>✎</button>
                </td>
                <td>{course.course}</td>
                <td>{course.description}</td>
                <td>{course.duration}</td>
                  <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={parseInt(course.active_status) === 0}
                    disabled={updatingId === course.id}
                    onChange={() =>
                      toggleStatus(course.id, parseInt(course.active_status))
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddModal(false)}>&times;</span>
            <h2>Add Course</h2>
            <form onSubmit={handleAddCourse}>
  <input
    placeholder="Course Name"
    value={form.course}
    onChange={e => setForm({ ...form, course: e.target.value })}
    required
  />
  <textarea
    placeholder="Description"
    value={form.description}
    onChange={e => setForm({ ...form, description: e.target.value })}
    required
  />
  <input
    placeholder="Duration"
    value={form.duration}
    onChange={e => setForm({ ...form, duration: e.target.value })}
    required
  />
  <div className="modal-buttons">
    <button type="button" onClick={() => setShowAddModal(false)}>Close</button>
    <button type="submit">Add Course</button>
  </div>
</form>

          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowEditModal(false)}>&times;</span>
            <h2>Edit Course</h2>
            <form onSubmit={handleEditSubmit}>
              <input value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} required />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} required />
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowEditModal(false)}>Close</button>
                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
