<?php
$servername = "localhost";
$username = "tetris_user";
$password = "tetris_user";
$dbname = "tetris";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
