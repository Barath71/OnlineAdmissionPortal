import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import './styles/ResetPassword.css'; 

const ResetPassword = () => {
  const [username, setUsername] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const sendOTP = async () => {
    if (!username.trim()) {
      alert("Please enter your username.");
      return;
    }

    try {
      const res = await fetch("http://localhost/StudentAdmission/back-end/send_otp.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username }),
      });
      const text = await res.text();

      if (text.includes("sent")) {
        setOtpSent(true);
      }
      alert("OTP sent Successfully! to Your Registered Email ID");
    } catch {
      alert("Failed to send OTP.");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!username || !otp || !newPassword || !confirmPassword) {
    alert("Please fill all fields.");
    return;
  }

  try {
    const res = await fetch("http://localhost/StudentAdmission/back-end/process_reset.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        otp,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Handle non-2xx responses like 400, 401, etc.
      alert(data.message || "Failed to reset password.");
      return;
    }

    alert(data.message);
    if (data.success) {
      navigate("/login");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Something went wrong.");
  }
};


  return (
    <div className="reset-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="field otp-field">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            disabled={!otpSent}
          />
          <button type="button" onClick={sendOTP}>
            Send OTP
          </button>
        </div>

        <div className="field">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <input
            type="password"
            placeholder="Re-Type New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button className="submit-button" type="submit">Submit</button>
        <button className="back-button" type="button" onClick={() => navigate("/login")}>Back to Login</button>
      </form>
    </div>
  );
};

export default ResetPassword;
