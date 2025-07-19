<?php
require 'db.php';

header('Content-Type: application/json'); // important for JSON fetch
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$id = $_POST['id'] ?? null;
$status = $_POST['active_status'] ?? null;

if ($id !== null && $status !== null) {
    $stmt = $conn->prepare("UPDATE courses SET active_status = ? WHERE id = ?");
    $stmt->bind_param("ii", $status, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Status updated"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "DB error: " . $stmt->error]);
    }
    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing parameters"]);
}

$conn->close();
?>