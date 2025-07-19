<?php
require_once 'db.php';

header("Access-Control-Allow-Origin: *"); // or specify your frontend origin like http://localhost:5173
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
// Decode incoming JSON
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['id'], $data['course'], $data['description'], $data['duration'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit;
}

$id = intval($data['id']); // Securely cast to integer
$course = trim($data['course']);
$description = trim($data['description']);
$duration = trim($data['duration']);

// Prepare and execute update
$stmt = $conn->prepare("UPDATE courses SET course = ?, description = ?, duration = ? WHERE id = ?");
if ($stmt) {
    $stmt->bind_param("sssi", $course, $description, $duration, $id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Course updated successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Update failed."]);
    }
    $stmt->close();
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database prepare failed."]);
}

$conn->close();
?>