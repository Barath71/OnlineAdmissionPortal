<?php
require 'db.php';

header("Access-Control-Allow-Origin: *"); // or specify your frontend origin like http://localhost:5173
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get raw JSON input
$data = json_decode(file_get_contents("php://input"), true);

$course = $data['course'] ?? '';
$description = $data['description'] ?? '';
$duration = $data['duration'] ?? '';

if ($course && $description && $duration) {
    $stmt = $conn->prepare("INSERT INTO courses (course, description, duration) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $course, $description, $duration);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
}
?>
