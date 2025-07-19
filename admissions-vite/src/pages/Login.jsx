import { useState } from "react";
import { useNavigate } from "react-router-dom";

import './styles/Login.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

   const navigate = useNavigate();
  
const handleLogin = async (e) => {
  e.preventDefault();

  if (!username || !password) {
    alert("Please fill out all fields.");
    return;
  }

  const formData = new FormData();
  formData.append("UserName", username);
  formData.append("Password", password);

  try {
    const res = await fetch("http://localhost/StudentAdmission/back-end/login.php", {
      method: "POST",
      body: formData,
        credentials: "include", // ← MUST add this!
    });

    const data = await res.json();
    alert(data.message);

    if (data.success) {
    localStorage.setItem("adminName", data.name); // <-- store admin name
      navigate("/Home"); // Navigate to Home.jsx
    }
  } catch (err) {
    alert("Login failed.");
    console.error(err);
  }
};


  const handleForgotPassword = () => {
    if (!username.trim()) {
      alert("Please enter your username first.");
      return;
    }

    fetch("http://localhost/StudentAdmission/back-end/checkuser.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "username=" + encodeURIComponent(username),
    })
      .then(res => res.text())
      .then(data => {
        if (data.trim() === "exists") { 
          window.location.href = `/ResetPassword?username=${encodeURIComponent(username)}`;
        } else {
          alert("Username not found.");
        }
      })
      .catch(err => {
        alert("Error checking username.");
        console.error(err);
      });
  };

  return (
    <form onSubmit={handleLogin}>
        <div className="login-page">
      <div className="login_container">
        <h2>Admin Login</h2>

        <div className="field">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <div className="forgot-password">
          <a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
        </div>

        <div className="buttons">
          <button type="submit">Login</button>
          <a href="/Register"><button type="button">Register</button></a>
        </div>
      </div>
      </div>
    </form>
  );
};

export default Login;
