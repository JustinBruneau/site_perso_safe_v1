<?php
// Connexion à la base de données
$conn = new mysqli('localhost', 'blocnotes_user', 'mot_de_passe', 'blocnotes');

// Vérifie la connexion
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Prépare la requête SQL pour récupérer toutes les notes avec leurs identifiants
$sql = "SELECT id, title, content FROM notes";

// Exécute la requête SQL
$result = $conn->query($sql);

// Crée un tableau pour stocker les données des notes avec leurs identifiants
$notes_with_id = array();

// Vérifie si des résultats ont été renvoyés
if ($result->num_rows > 0) {
    // Parcourt chaque ligne de résultat
    while($row = $result->fetch_assoc()) {
        // Ajoute les données de la note avec son identifiant au tableau
        $notes_with_id[] = $row;
    }
}

// Convertit le tableau en format JSON
echo json_encode($notes_with_id);

// Ferme la connexion à la base de données
$conn->close();
?>
