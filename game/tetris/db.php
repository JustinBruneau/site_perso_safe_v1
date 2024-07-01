<?php
$servername = "localhost";
$username = "tetris_user";
$password = "tetris_user";
$dbname = "tetris";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
