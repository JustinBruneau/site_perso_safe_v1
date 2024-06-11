<?php
// Vérifie si l'ID de la note à modifier est présent dans l'URL
if (isset($_GET['id'])) {
    // Récupère l'ID de la note depuis l'URL
    $note_id = $_GET['id'];

    // Connexion à la base de données
    $conn = new mysqli('localhost', 'blocnotes_user', 'mot_de_passe', 'blocnotes');

    // Vérifie la connexion
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prépare une requête SQL pour sélectionner la note à modifier
    $sql = "SELECT * FROM notes WHERE id = ?";
    $stmt = $conn->prepare($sql);

    // Lie les paramètres à la requête
    $stmt->bind_param("i", $note_id);

    // Exécute la requête SQL
    $stmt->execute();

    // Récupère le résultat de la requête
    $result = $stmt->get_result();

    // Vérifie s'il y a des résultats
    if ($result->num_rows > 0) {
        // Récupère les données de la note
        $row = $result->fetch_assoc();
        $title = $row['title'];
        $content = $row['content'];
    } else {
        echo "Note non trouvée.";
        exit();
    }

    // Ferme la connexion à la base de données
    $conn->close();
} else {
    echo "ID de note manquant.";
    exit();
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modifier la note</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Modifier la note</h1>

    <!-- Formulaire pour modifier la note -->
    <form id="edit-note-form" method="POST" action="update_note.php">
        <input type="hidden" name="id" value="<?php echo $note_id; ?>">
        <input type="text" id="title" name="title" placeholder="Titre" value="<?php echo $title; ?>" required><br>
        <textarea id="content" name="content" placeholder="Contenu" required><?php echo $content; ?></textarea><br>
        <button type="submit">Enregistrer</button>
    </form>
</body>
</html>
