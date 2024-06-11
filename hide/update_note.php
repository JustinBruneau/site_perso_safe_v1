<?php
// Vérifie si les données du formulaire ont été envoyées
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['id'], $_POST['title'], $_POST['content'])) {
    // Récupère les données du formulaire
    $note_id = $_POST['id'];
    $title = $_POST['title'];
    $content = $_POST['content'];

    // Connexion à la base de données
    $conn = new mysqli('localhost', 'blocnotes_user', 'mot_de_passe', 'blocnotes');

    // Vérifie la connexion
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prépare une requête SQL pour mettre à jour la note dans la base de données
    $sql = "UPDATE notes SET title = ?, content = ? WHERE id = ?";

    // Prépare la requête SQL
    $stmt = $conn->prepare($sql);

    // Lie les paramètres à la requête
    $stmt->bind_param("ssi", $title, $content, $note_id);

    // Exécute la requête SQL
    if ($stmt->execute()) {
        // Redirige l'utilisateur vers la page principale
        header("Location: index.html");
        exit(); // Assure que le script s'arrête ici
    } else {
        echo "Erreur lors de la mise à jour de la note : " . $conn->error;
    }

    // Ferme la connexion à la base de données
    $conn->close();
} else {
    echo "Erreur : méthode de requête incorrecte ou données de formulaire manquantes.";
}
?>
