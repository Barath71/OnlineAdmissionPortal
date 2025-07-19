<?php
// Enable CORS (same origin as Vite frontend)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

session_start();
session_unset();
session_destroy();

echo json_encode(["success" => true, "message" => "Logged out successfully"]);
?>