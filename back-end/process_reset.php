<?php
header("Access-Control-Allow-Origin: *");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type");

// Allow specific methods
header("Access-Control-Allow-Methods: POST, OPTIONS");

// For preflight (OPTIONS) requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'] ?? '';
$otp = $data['otp'] ?? '';
$newPassword = $data['new_password'] ?? '';
$confirmPassword = $data['confirm_password'] ?? '';

if (!$username || !$otp || !$newPassword || !$confirmPassword) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "All fields are required."]);
  exit;
}

if ($newPassword !== $confirmPassword) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Passwords do not match."]);
  exit;
}

$result = $conn->query("SELECT otp FROM admins WHERE username = '$username'");
if ($result->num_rows !== 1) {
  http_response_code(404);
  echo json_encode(["success" => false, "message" => "User not found."]);
  exit;
}

$row = $result->fetch_assoc();
if ($row['otp'] !== $otp) {
  http_response_code(401);
  echo json_encode(["success" => false, "message" => "Invalid OTP."]);
  exit;
}

$hashedPassword = hash("sha256", $newPassword);
$update = $conn->query("UPDATE admins SET password = '$hashedPassword', otp = NULL WHERE username = '$username'");

if ($update) {
  echo json_encode(["success" => true, "message" => "Password changed successfully."]);
} else {
  echo json_encode(["success" => false, "message" => "Failed to update password."]);
}
?>
