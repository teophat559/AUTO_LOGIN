<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
  $up = $_FILES['file'];
  $target = '../uploads/' . basename($up['name']);
  if (move_uploaded_file($up['tmp_name'], $target)) {
    echo json_encode(["success"=>true]);
  } else {
    echo json_encode(["success"=>false]);
  }
} else {
  echo json_encode(["error"=>"No file"]);
}
?>
