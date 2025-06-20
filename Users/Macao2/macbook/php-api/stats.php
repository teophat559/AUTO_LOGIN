<?php
require_once "db.php";
$db = getdb();
$res = $db->query("SELECT COUNT(*) as votes, SUM(success) as success, SUM(error) as errors FROM logs")->fetch(PDO::FETCH_ASSOC);
echo json_encode($res);
?>
