<?php
require_once "db.php";
$db = getdb();
$res = $db->query("SELECT * FROM logs ORDER BY id DESC LIMIT 50")->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($res);
?>
