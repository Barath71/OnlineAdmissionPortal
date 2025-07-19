<?php
require_once 'db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$sql = "SELECT courses FROM course WHERE active_status = 0";
$result = $conn->query($sql);

$courses = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $courses[] = [
            "course" => htmlspecialchars($row['course'], ENT_QUOTES)
        ];
    }
    echo json_encode($courses);
} else {
    echo json_encode([]);
}
$conn->close();
?>
