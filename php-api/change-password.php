<?php
header('Content-Type: application/json');
require 'db.php';
$data = json_decode(file_get_contents('php://input'), true);
$user = $conn->real_escape_string($data['username']);
$oldpw = $conn->real_escape_string($data['oldpw']);
$newpw = $conn->real_escape_string($data['newpw']);
$res = $conn->query("SELECT * FROM users WHERE username='$user' AND password=MD5('$oldpw')");
if($res->num_rows) {
  $conn->query("UPDATE users SET password=MD5('$newpw') WHERE username='$user'");
  echo json_encode(["ok"=>1]);
} else {
  http_response_code(403);
  echo json_encode(["error"=>"Sai mật khẩu cũ"]);
}
?>
