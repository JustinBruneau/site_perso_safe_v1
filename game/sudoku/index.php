<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="robots" content="index, follow" />
<meta http-equiv='cache-control' content='no-cache'>
<meta http-equiv='expires' content='0'>
<meta http-equiv='pragma' content='no-cache'>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="keywords" content="jeu,jeux,webmaster,jouer,en ligne,gratuit,grille,sudoku,4x4, 6x6, 8x8, 9x9, 10x10, 12x12, 14x14,16x16,facile,moyen,difficile,phpsudo,lettre,numero,chiffre,option,site internet">
<meta name="description" content="Créez votre grille de sudoku (4x4, 6x6, 8x8, 9x9, 10x10, 12x12, 14x14 ou 16x16). Facile ou difficile ? Numéros, lettres ou les deux ? ">
<title>Une partie de Sudoku ? Jouez en ligne !</title>
<script src="js/jquery-3.7.1.min.js" type="text/javascript"></script>
<script src="js/phpsudo.js.php"></script>
<script>window.onload = function() {$('#grille').PhpSudo({'TailleCasePX':'25', 'Dimension':'4*2','AfficheSelectionGrilles':true,'AfficherLaGrille':false,"TailleTexte": "18","GenererNouvelleGrille":'true'});};</script>
</head>
<body>
	<p>Génerer votre grille :</p>
	<div id="grille" style="min-height:200px;"></div>
</body>
</html>
