// ViewApplication.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './styles/ViewApplication.css';

const ViewApplication = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost/StudentAdmission/back-end/getApplication.php?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setApp(data);
          setStatus(data.status);
        }
      })
      .catch((err) => {
        console.error("Fetch failed", err);
        setError("Failed to load application.");
      });
  }, [id]);

const handleStatusUpdate = (e) => {
  e.preventDefault();

  fetch("http://localhost/StudentAdmission/back-end/update_status.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `application_id=${id}&status=${status}`
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.text();
    })
    .then(msg => {
      alert(msg); // Shows "Status updated successfully."
    })
    .catch(err => {
      alert("Failed to update status.");
      console.error(err);
    });
};

  if (error) return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;

  if (!app) return <div>Loading...</div>;

  return (
    <div className="view-container">
      <h2>Application Details</h2>
      <div className="field"><div className="label">Full Name:</div><div className="value">{app.first_name} {app.last_name}</div></div>
      <div className="field"><div className="label">Email:</div><div className="value">{app.email}</div></div>
      <div className="field"><div className="label">Phone:</div><div className="value">{app.phone}</div></div>
      <div className="field"><div className="label">Gender:</div><div className="value">{app.gender}</div></div>
      <div className="field"><div className="label">DOB:</div><div className="value">{app.dob}</div></div>
      <div className="field"><div className="label">Group:</div><div className="value">{app.group_name}</div></div>
      <div className="field"><div className="label">Course:</div><div className="value">{app.course}</div></div>
      <div className="field"><div className="label">Total Marks:</div><div className="value">{app.total_marks}</div></div>
      <div className="field"><div className="label">Address:</div><div className="value">{app.address}</div></div>
      <div className="field"><div className="label">Submitted On:</div><div className="value">{app.submitted_on}</div></div>

      <div className="card-row">
        <div className="card">
          <div className="label">Photo</div>
          <div className="value">
            <img src={`http://localhost/StudentAdmission/back-end/${app.photo_path}`} alt="Applicant" style={{ width: '80%', height: '200px', objectFit: 'cover', borderRadius: '50%', border: '3px solid #ccc' }} />
            <br />
            <a href={`http://localhost/StudentAdmission/back-end/${app.photo_path}`} className="btn-download" download>Download Photo</a>
          </div>
        </div>

        <div className="card">
          <div className="label">Marksheet</div>
          <div className="value">
            <embed src={`http://localhost/StudentAdmission/back-end/${app.marksheet_path}`} width="100%" height="200px" type="application/pdf" />
            <br />
            <a href={`http://localhost/StudentAdmission/back-end/${app.marksheet_path}`} className="btn-download" download>Download Marksheet</a>
          </div>
        </div>
      </div>

      <div className="card decision-section">
        <form onSubmit={handleStatusUpdate}>
          <div className="label">Application Decision:</div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="1">Pending</option>
            <option value="2">Accepted</option>
            <option value="3">Rejected</option>
          </select>
          <div className="buttons">
            <button type="submit">Update Status</button>
             <Link to="/home" className="btn-download">&larr; Back to Dashboard</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewApplication;
