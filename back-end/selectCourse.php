<?php
session_start(); 

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// ✅ Check if session exists
if (!isset($_SESSION['adminName'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

require 'db.php';

$result = $conn->query("SELECT * FROM courses");

$courses = [];
while ($row = $result->fetch_assoc()) {
    $courses[] = $row;
}

// ✅ Return admin name also
echo json_encode([
    "courses" => $courses,
    "adminName" => $_SESSION['adminName']
]);

$conn->close();
