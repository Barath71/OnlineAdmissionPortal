# 🎓 Online Admission Portal

A full-stack web application for managing student admissions, built with **Vite + React** on the frontend and **PHP + MySQL** on the backend.

---

## 🔍 Features

- 📝 Student application submission form
- 📄 View all submitted applications
- 🗂 Admin dashboard with decision controls (Approve/Reject)
- ⬇️ Download uploaded documents (Resume, Marksheets)
- 📬 Status updates and view by application ID
- 💾 Data stored securely in a MySQL database
- 🛡 Basic security with prepared statements to prevent SQL injection

---

## 🛠️ Tech Stack

| Layer       | Technology                |
|-------------|---------------------------|
| Frontend    | Vite + React + Tailwind CSS |
| Backend     | PHP (Vanilla)             |
| Database    | MySQL                     |
| Communication | REST API (AJAX/Fetch)      |

---

## 📁 Project Structure

```plaintext
StudentAdmission/
│
├── front-end/           # React + Vite App
│   ├── src/
│   │   ├── components/  # Components (Home, View, Dashboard, etc.)
│   │   └── App.jsx
│   └── index.html
│
├── back-end/            # PHP Backend
│   ├── db.php           # Database connection
│   ├── submitApplication.php
│   ├── getApplications.php
│   ├── getApplication.php?id=...
│   ├── updateStatus.php
│   └── upload/          # Uploaded files
│
└── README.md
