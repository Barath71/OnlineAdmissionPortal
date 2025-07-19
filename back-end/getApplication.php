<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid ID"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM application WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$app = $result->fetch_assoc();

if ($app) {
    echo json_encode($app);
} else {
    http_response_code(404);
    echo json_encode(["error" => "Application not found"]);
}
