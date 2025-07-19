import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './styles/Application.css';

function ApplicationForm() {
const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    email: '',
    phone: '',
    address: '',
    groupSelect: '',
    marks: '',
    courseSelect: '',
    acknowledge: false,
  });

  const [courses, setCourses] = useState([]);
  const [marksheet, setMarksheet] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    fetch('http://localhost/StudentAdmission/back-end/getCourse.php')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validate = () => {
    const {
        email, phone, acknowledge
    } = form;

    // if (!firstName) return alert("First Name is required.");
    // if (!lastName) return alert("Last Name is required.");
    // if (!gender) return alert("Gender is required.");
    // if (!dob) return alert("Date of Birth is required.");
    // if (!address) return alert("Address is required.");
    // if (!groupSelect) return alert("Please select a group.");
    // if (!marks) return alert("Total Marks are required.");
    // if (!courseSelect) return alert("Please select a course.");
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) return alert("Valid Email is required.");
     if (!phone || !/^\d{10}$/.test(phone)) return alert("Phone number must be 10 digits.");
    if (!marksheet || marksheet.size > 2 * 1024 * 1024 || marksheet.type !== 'application/pdf')
      return alert("Marksheet must be a PDF under 2 MB.");
    if (!photo || photo.size > 500 * 1024 || !['image/jpeg', 'image/png'].includes(photo.type))
      return alert("Photo must be JPG/PNG and under 500 KB.");
    if (!acknowledge) return alert("Please acknowledge the declaration.");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    formData.append('marksheet', marksheet);
    formData.append('photo', photo);

    try {
      const response = await fetch('http://localhost/StudentAdmission/back-end/submit.php', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error(error);
      alert("Submission failed. Try again.");
    }
  };

  return (
    <div className="container">
      <h2>Undergraduate Course Application</h2>
      <form id="appForm" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row">
          <div className="field">
            <label>First Name</label>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required/>
          </div>
          <div className="field">
            <label>Last Name</label>
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required/>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Gender</label>
            <div className="gender">
              {['Male', 'Female', 'Other'].map((g) => (
                <label key={g}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={form.gender === g}
                    onChange={handleChange} required
                  /> {g}
                </label>
              ))}
            </div>
          </div>
          <div className="field">
            <label>Date of Birth</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required/>
          </div>
          <div className="field">
            <label>Phone Number</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} required/>
          </div>
        </div>

        <div className="field full">
          <label>Address</label>
          <textarea name="address" value={form.address} onChange={handleChange} required />
        </div>

        <div className="row">
          <div className="field">
            <label>Group</label>
            <select name="groupSelect" value={form.groupSelect} onChange={handleChange} required>
              <option value="">-- Select Group --</option>
              <option value="cse">B.E - CSE</option>
              <option value="mech">B.E - MECH</option>
              <option value="civil">B.E - CIVIL</option>
              <option value="eee">B.E - EEE</option>
              <option value="ece">B.E - ECE</option>
              <option value="bsc">B.Sc</option>
              <option value="bcom">B.Com</option>
              <option value="ba">BA</option>
              <option value="bca">BCA</option>
              <option value="mba">MBA</option>
              <option value="mca">MCA</option>
              <option value="msc">M.Sc</option>
              <option value="mcom">M.Com</option>
            </select>
          </div>

          <div className="field">
            <label>Total Marks (out of 600)</label>
            <input type="text" name="marks" value={form.marks} onChange={handleChange} required />
          </div>
        </div>

        <div className="field full">
          <label>Select Course</label>
          <select name="courseSelect" value={form.courseSelect} onChange={handleChange} required>
            <option value="">-- Select Course --</option>
            {courses.map((c, i) => (
              <option key={i} value={c.course}>{c.course}</option>
            ))}
          </select>
        </div>

        <div className="field full">
          <label>12th Marksheet</label>
          <input type="file" name="marksheet" accept="application/pdf" onChange={(e) => setMarksheet(e.target.files[0])} />
          <span className="note">PDF only, Max size 2 MB</span>
        </div>

        <div className="field full">
          <label>Photo</label>
          <input type="file" name="photo" accept="image/png, image/jpeg" onChange={(e) => setPhoto(e.target.files[0])} />
          <span className="note">JPG/PNG only, Max size 500 KB</span>
        </div>

        <div className="field full">
          <label>
            <input type="checkbox" name="acknowledge" checked={form.acknowledge} onChange={handleChange} />
            I acknowledge the information provided is true to my knowledge.
          </label>
        </div>

        <div className="buttons">
          <button type="submit">Submit</button>
          <button type="button" onClick={() => window.location.reload()}>Clear</button>
        </div>
      </form>
    </div>
  );
}

export default ApplicationForm
