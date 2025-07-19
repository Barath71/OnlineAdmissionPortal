<?php
require 'db.php';


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents("php://input"), true);

$name     = trim($data['name'] ?? '');
$mobile   = trim($data['mobile'] ?? '');
$email    = trim($data['email'] ?? '');
$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');

if (!$name || !$mobile || !$email || !$username || !$password) {
  echo json_encode(["success" => false, "message" => "All fields are required."]);
  exit;
}

$hashedPassword = hash("sha256", $password);

$stmt = $conn->prepare("INSERT INTO admins(name, mobile, email, username, password) VALUES (?, ?, ?, ?, ?)");

if (!$stmt) {
  echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
  exit;
}

$stmt->bind_param("sssss", $name, $mobile, $email, $username, $hashedPassword);

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Admin registered successfully."]);
} else {
  echo json_encode(["success" => false, "message" => "Registration failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
