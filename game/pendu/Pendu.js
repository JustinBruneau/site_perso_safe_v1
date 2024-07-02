/*global document, clearInterval, setInterval, timer, dictionnaire*/

// définition des couleurs de fond #Fx0
var fond = ["F", "D", "C", "9", "6", "3", "0"];

var dom_body, dom_aide, dom_btnaide, dom_pendu, dom_console, dom_jeu, dom_controle, motSecret, motVisible, numeroPendu, cFini, lettresVues, nombreDErrreurs, numeroTest, nombreDeLettres, nombreDeMots, victoire;

//================== effacerElement ==================
function effacerElement(dom) {
	while (dom.firstChild) {
		dom.removeChild(dom.firstChild);
	}
}

//============= afficherSurConsole =============
function afficherSurConsole(html, style) {
	if (style) {
		dom_console.className = style;
	} else {
		dom_console.className = null;
	}
	dom_console.innerHTML = html;
}

//================== actualiserPendu ==================
function actualiserPendu() {
	dom_body.setAttribute("style", "background-color: #F" + fond[numeroPendu] + "0;");
	dom_pendu.setAttribute("src", "img/p" + numeroPendu + ".gif");
}

//================== remiseAZero ==================
function remiseAZero() {
	var k, c;
	cFini = false;
	dom_controle.className = "invisible";
	lettresVues = 0;
	nombreDErrreurs = 0;
	numeroTest = 0;
	numeroPendu = 0;
	actualiserPendu();
	var btns = document.getElementsByTagName("button");
	for (k = 0; k < btns.length; k++) {
		btns[k].disabled = false;
	}
	// tirer un mot au hasard
	k = Math.floor(Math.random() * nombreDeMots);
	motSecret = dictionnaire[k];
	nombreDeLettres = motSecret.length;
	// préparer l'affichage
	motVisible = motSecret.charAt(0);
	for (k = 1; k < nombreDeLettres - 1; k++) {
		c = motSecret.charAt(k);
		motVisible += c === "-" || c === "'"  || c === " " ? c : ".";
	}
	motVisible += motSecret.charAt(nombreDeLettres - 1);
	dom_jeu.innerHTML = motVisible;
}

//================== CONTROLES ==================
//================== nouveauBouton ==================
function nouveauBouton(titre, onClick) {
	var element = document.createElement('button');
	element.setAttribute('type', 'button');
	element.setAttribute('onclick', onClick);
	element.innerHTML = titre;
	return element;
}

//================== clicOuvrirAide ==================
function clicOuvrirAide() {
	effacerElement(dom_btnaide);
	dom_btnaide.appendChild(nouveauBouton("Cacher le mode d'emploi", "clicFermerAide()"));
	dom_aide.className = null;
}

//================== clicFermerAide ==================
function clicFermerAide() {
	effacerElement(dom_btnaide);
	dom_btnaide.appendChild(nouveauBouton("Mode d'emploi", "clicOuvrirAide()"));
	dom_aide.className = "invisible";
}

//================== crierVictoire ==================
function crierVictoire() {
	victoire--;
	if (victoire === 0) {
		clearInterval(timer);
		dom_body.setAttribute("style", "background-color: #F" + fond[0] + "0;");
		return;
	}
	dom_body.setAttribute("style", "background-color: #F" + fond[Math.floor(Math.random() * 6)] + "0;");
	
}

//================== afficherEtat ==================
function afficherEtat(lettre, ok) {
	var txt = "Essai n° " + numeroTest + " : &nbsp; &nbsp; &nbsp; La lettre " + lettre + " est " + (ok ? "présente" : "absente");
	if (lettresVues > 1) {
		txt += ", &nbsp; &nbsp;" + lettresVues + " lettres trouvées";
	} else if (lettresVues > 0) {
		txt += ", &nbsp; &nbsp; une lettre trouvée";
	}
	if (nombreDErrreurs === 5) {
		txt += ", &nbsp; &nbsp; <i>5<sup>ième</sup> et dernière erreur permise</i>";
	} else if (nombreDErrreurs > 1) {
		txt += ", &nbsp; &nbsp;" + nombreDErrreurs + " erreurs";
	} else if (nombreDErrreurs > 0) {
		txt += ", &nbsp; &nbsp; une erreur";
	}
	afficherSurConsole(txt);
}

//================== clicLettre ==================
function clicLettre(obj, lettre) {
	if (cFini) {
		return;
	}
	var k, cs, cv;
	var motNouveau = "";
	var ok = false;
	numeroTest++;
	for (k = 0; k < nombreDeLettres; k++) {
		cs = motSecret.charAt(k);
		cv = motVisible.charAt(k);
		if (cs === cv) {
			motNouveau += cs;
		} else if (cs === lettre) {
			motNouveau += cs;
			lettresVues++;
			ok = true;
		} else {
			motNouveau += cv;
		}
	}
	if (!ok) {
		nombreDErrreurs++;
		numeroPendu++;
		actualiserPendu();
	}
	motVisible = motNouveau;
	afficherEtat(lettre, ok);
	obj.disabled = true;
	dom_jeu.innerHTML = motVisible;
	if (motVisible === motSecret) {
		if (nombreDErrreurs === 0) {
			victoire = 50;
			timer = setInterval(crierVictoire, 25);
		}
		afficherSurConsole("Bravo ! &nbsp; Vous avez gagné" + (nombreDErrreurs === 0 ? " sans erreur." : ", mais vous avez fait " + nombreDErrreurs + " erreur" + (nombreDErrreurs > 1 ? "s." : ".")), "bravo");
		cFini = true;
		dom_controle.className = null;
		dom_body.setAttribute("style", "background-color: #9F9;");
		return;
	} else if (numeroPendu === 6) {
		afficherSurConsole("Perdu ! &nbsp; Vous avez trouvé " + lettresVues + " lettre" + (lettresVues > 1 ? "s" : "") + " sur les " + (nombreDeLettres - 2) + " de : &nbsp; " + motSecret, "perdu");
		cFini = true;
		dom_controle.className = null;
	}
}
//================== clicNouvellePartie ==================
function clicNouvellePartie() {
	afficherSurConsole("À vous de jouer . . .");
	remiseAZero();
}

//================== init ==================
function init() {
	dom_body = document.getElementsByTagName("body")[0];
	// zone d'affichage de l'aide (bouton aide au départ)
	dom_aide = document.getElementById("aide");
	dom_btnaide = document.getElementById("btnaide");
	// zone d'affichage de l'image du Pendu
	dom_pendu = document.getElementById("pendu");
	// zone d'affichage des informations (* au départ)
	dom_console = document.getElementById("console");
	// zone d'affichage du bouton Nouveau Mot
	dom_controle = document.getElementById("controle");
	// zone de définition du jeu (vide au départ)
	dom_jeu = document.getElementById("jeu");
	remiseAZero();
	afficherSurConsole("Mon dictionnaire contient " + nombreDeMots + " mots", "perdu");
}

//================== clicDebug ==================
function clicDebug() {
	afficherSurConsole(motSecret);
}
