<?php


header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Start the session
session_start();

require 'db.php';

$username = trim($_POST['UserName'] ?? '');
$password = trim($_POST['Password'] ?? '');

if (!$username || !$password) {
    echo json_encode(["success" => false, "message" => "Please fill in both username and password."]);
    exit;
}

$hashedPassword = hash("sha256", $password);

$stmt = $conn->prepare("SELECT * FROM admins WHERE username = ? AND password = ?");
$stmt->bind_param("ss", $username, $hashedPassword);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // ✅ Corrected variable here
    $_SESSION['adminName'] = $user['name'];

    echo json_encode([
        "success" => true,
        "message" => "Login successful.",
        "name" => $user['name']
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid username or password."]);
}

$stmt->close();
$conn->close();
?>
