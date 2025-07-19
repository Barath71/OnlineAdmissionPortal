<?php
$allowedDirs = ['uploads/photo_', 'uploads/marksheet_'];

if (!isset($_GET['file'])) {
    http_response_code(400);
    exit("Missing file parameter.");
}

$encoded = basename($_GET['file']); // prevent path traversal
$fullPath = "uploads/" . $encoded;

$isAllowed = false;
foreach ($allowedDirs as $prefix) {
    if (strpos($fullPath, $prefix) === 0) {
        $isAllowed = true;
        break;
    }
}

if (!$isAllowed || !file_exists($fullPath)) {
    http_response_code(404);
    exit("File not found or access denied.");
}

$mime = mime_content_type($fullPath);
header("Content-Type: $mime");
header("Content-Disposition: inline; filename=" . basename($fullPath));
readfile($fullPath);
exit;
