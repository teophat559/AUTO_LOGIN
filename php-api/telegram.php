<?php
// Cấu hình token bot & chat id của bạn
$token = 'YOUR_BOT_TOKEN';
$chat_id = 'YOUR_CHAT_ID';
$message = $_POST['message'] ?? 'No message';
$url = "https://api.telegram.org/bot$token/sendMessage";
$params = [
  'chat_id' => $chat_id,
  'text' => $message,
];
$options = ['http'=>[
  'method'=>'POST',
  'header'=>'Content-Type: application/x-www-form-urlencoded',
  'content'=>http_build_query($params)
]];
$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
echo json_encode(["sent"=>true]);
?>
