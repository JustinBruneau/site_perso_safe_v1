<?php
include 'db.php';

$sql = "SELECT username, score FROM scores ORDER BY score DESC LIMIT 10";
$result = $conn->query($sql);

$top_scores = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $top_scores[] = $row;
    }
}

$conn->close();
echo json_encode($top_scores);
?>
