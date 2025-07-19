<?php
require 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Enable error reporting (for development only)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Read username from request body (x-www-form-urlencoded)
$username = trim($_POST['username'] ?? '');

if (!$username) {
    echo "missing";
    exit;
}

$stmt = $conn->prepare("SELECT id FROM admins WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    echo "exists";
} else {
    echo "not_found";
}

$stmt->close();
$conn->close();
?>
