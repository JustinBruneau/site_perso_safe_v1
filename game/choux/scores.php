<?php
$servername = "localhost";
$username = "root";
$password = "password";
$dbname = "jeu_scores";

// Créer la connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Insérer un nouveau score
    $nom = $_POST['nom'];
    $score = $_POST['score'];

    $sql = "INSERT INTO scores (nom, score) VALUES ('$nom', '$score')";
    if ($conn->query($sql) === TRUE) {
        echo "Nouveau score ajouté";
    } else {
        echo "Erreur: " . $sql . "<br>" . $conn->error;
    }
} else {
    // Récupérer les scores
    $sql = "SELECT nom, score FROM scores ORDER BY score DESC LIMIT 10";
    $result = $conn->query($sql);

    $scores = array();
    while($row = $result->fetch_assoc()) {
        $scores[] = $row;
    }
    echo json_encode($scores);
}

$conn->close();
?>
