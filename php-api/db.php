<?php
function getdb() {
  return new PDO("sqlite:../data.sqlite");
}
?>
