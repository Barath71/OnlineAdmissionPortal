<?php
// Enable CORS for development (adjust domain as needed for production)

session_start();
error_log("SESSION ID: " . session_id());


header("Access-Control-Allow-Origin: http://localhost:5173"); // Change this if frontend runs on a different port or domain
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");


// Return unauthorized if admin is not logged in
if (!isset($_SESSION['adminName'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

// Include your DB connection
require_once 'db.php';

// Initialize status counts
$status_counts = [
    'pending' => 0,
    'accepted' => 0,
    'rejected' => 0
];

// Get application status counts
$countSql = "SELECT status, COUNT(*) as total FROM application GROUP BY status";
$countResult = $conn->query($countSql);

if ($countResult && $countResult->num_rows > 0) {
    while ($row = $countResult->fetch_assoc()) {
        switch ((int)$row['status']) {
            case 1: $status_counts['pending'] = (int)$row['total']; break;
            case 2: $status_counts['accepted'] = (int)$row['total']; break;
            case 3: $status_counts['rejected'] = (int)$row['total']; break;
        }
    }
}

// Prepare query to fetch applications (with optional filtering)
$filterSql = "";
$statusName = "All Applications";

if (isset($_GET['status'])) {
    $status = (int) $_GET['status'];
    $filterSql = "WHERE status = $status";

    if ($status === 1) $statusName = "Pending Applications";
    elseif ($status === 2) $statusName = "Accepted Applications";
    elseif ($status === 3) $statusName = "Rejected Applications";
}

// Fetch applications
$applications = [];
$query = "SELECT * FROM application $filterSql ORDER BY submitted_on DESC";
$result = $conn->query($query);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $applications[] = [
            "id" => $row['id'],
            "first_name" => $row['first_name'],
            "last_name" => $row['last_name'],
            "email" => $row['email'],
            "course" => $row['course'],
            "status" => (string)$row['status'],
            "created_at" => $row['submitted_on']
        ];
    }
}

// Return JSON response
echo json_encode([
    "adminName" => $_SESSION['adminName'],
    "applications" => $applications,
    "status_counts" => $status_counts,
    "status_name" => $statusName
]);
?>
