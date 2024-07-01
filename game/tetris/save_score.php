<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $score = $_POST['score'];

    $stmt = $conn->prepare("INSERT INTO scores (username, score) VALUES (?, ?)");
    $stmt->bind_param("si", $username, $score);

    if ($stmt->execute()) {
        echo "Score saved successfully";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
