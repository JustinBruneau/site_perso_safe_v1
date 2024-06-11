<?php
// Vérifie si les données du formulaire ont été envoyées
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupère les données du formulaire
    $title = $_POST['title'];
    $content = $_POST['content'];

    // Connexion à la base de données
    $conn = new mysqli('localhost', 'blocnotes_user', 'mot_de_passe', 'blocnotes');

    // Vérifie la connexion
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prépare une requête SQL pour insérer une nouvelle note dans la base de données
    $sql = "INSERT INTO notes (title, content) VALUES ('$title', '$content')";

    // Exécute la requête SQL
    if ($conn->query($sql) === TRUE) {
        echo "Nouvelle note créée avec succès.";
    } else {
        echo "Erreur lors de la création de la note : " . $conn->error;
    }

    // Ferme la connexion à la base de données
    $conn->close();
} else {
    echo "Erreur : méthode de requête incorrecte.";
}
?>
