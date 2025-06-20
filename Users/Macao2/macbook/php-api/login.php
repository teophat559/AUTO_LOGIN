<?php
require_once "db.php";
$json = json_decode(file_get_contents('php://input'), true);
$username = $json['username'] ?? '';
$password = $json['password'] ?? '';
$db = getdb();
$stm = $db->prepare("SELECT * FROM users WHERE username=? AND password=?");
$stm->execute([$username, $password]);
$user = $stm->fetch(PDO::FETCH_ASSOC);
if($user) {
  echo json_encode(["token"=>base64_encode($username)]);
} else {
  echo json_encode(["error"=>"login_failed"]);
}
?>
