<?php
header("Access-Control-Allow-Origin: *"); // Or use specific domain in production
header("Content-Type: application/json");

require_once 'db.php';
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// Load .env
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Get POST data (expects JSON)
$username = $_POST['username'] ?? '';


if (empty($username)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Username is missing"]);
    exit;
}

$username = $conn->real_escape_string($username);
$result = $conn->query("SELECT email FROM admins WHERE username = '$username'");

if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();
    $email = $row['email'];
    $otp = rand(100000, 999999);

    $conn->query("UPDATE admins SET otp = '$otp' WHERE username = '$username'");

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = $_ENV['SMTP_HOST'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['SMTP_USER'];
        $mail->Password   = $_ENV['SMTP_PASS'];
        $mail->SMTPSecure = $_ENV['SMTP_SECURE'];
        $mail->Port       = $_ENV['SMTP_PORT'];

        $mail->setFrom($_ENV['SMTP_USER'], $_ENV['SMTP_FROM_NAME']);
        $mail->addAddress($email);
        $mail->Subject = 'Your OTP Code';
        $mail->Body    = "Hello $username,\n\nYour OTP is: $otp\n\nThank you.";

        $mail->send();

        echo json_encode(["status" => "success", "message" => "OTP sent successfully", "email" => $email]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Mail error: " . $mail->ErrorInfo]);
    }
} else {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Username not found"]);
}
?>
