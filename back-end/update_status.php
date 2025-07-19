<?php
require 'db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: text/plain");

$id = $_POST['application_id'] ?? null;
$status = $_POST['status'] ?? null;

if ($id && $status) {
    $stmt = $conn->prepare("UPDATE application SET status = ? WHERE id = ?");
    $stmt->bind_param("ii", $status, $id);
    if ($stmt->execute()) {
        echo "Status updated successfully.";
    } else {
        http_response_code(500); // Internal Server Error
        echo "Update failed.";
    }
} else {
    http_response_code(400); // Bad Request
    echo "Invalid data.";
}
?>
