<?php
// Vérifie si les données du formulaire ont été envoyées
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['id'])) {
    // Récupère l'identifiant de la note à supprimer
    $note_id = $_POST['id'];

    // Connexion à la base de données
    $conn = new mysqli('localhost', 'blocnotes_user', 'mot_de_passe', 'blocnotes');

    // Vérifie la connexion
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prépare une requête SQL pour supprimer la note de la base de données
    $sql = "DELETE FROM notes WHERE id = $note_id";

    // Exécute la requête SQL
    if ($conn->query($sql) === TRUE) {
        // Envoie une réponse JSON indiquant que la suppression a réussi
        echo json_encode(array("success" => true));
    } else {
        // Envoie une réponse JSON indiquant une erreur
        echo json_encode(array("error" => "Erreur lors de la suppression de la note : " . $conn->error));
    }

    // Ferme la connexion à la base de données
    $conn->close();
} else {
    // Envoie une réponse JSON indiquant une erreur
    echo json_encode(array("error" => "Erreur : méthode de requête incorrecte ou identifiant de note manquant."));
}
?>
