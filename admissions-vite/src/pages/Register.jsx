import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './styles/Register.css';


const Register = () => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key in form) {
      if (!form[key].trim()) {
        alert(`Please fill out the ${key} field.`);
        return;
      }
    }

    try {
      const res = await fetch("http://localhost/StudentAdmission/back-end/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      alert(result.message);
      if (result.success) {
        navigate("/Login");
      }
    } catch (err) {
      alert("Registration failed. Try again later.");
      console.error(err);
    }
  };

  return (
    <div className="form-box">
      <h2>Admin Registration</h2>
      <form onSubmit={handleSubmit}>
        {["name", "mobile", "email", "username", "password"].map((field) => (
          <div className="field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={field === "username" || field === "password" ? `Create ${field}` : ""}
            />
          </div>
        ))}

        <div className="buttons">
          <button type="submit">Submit</button>
          <Link to="/Login">
            <button type="button">Login</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
