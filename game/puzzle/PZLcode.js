/*globals document window  setInterval clearInterval $ */

//============= DATA =============
var DATA = [
	{
		nom: "Street Art",
		image: "img/Street.png",
		largeurImage: 624,
		hauteurImage: 416,
		decoupage: [
			{lignes: 2, colonnes: 3},  
			{lignes: 2, colonnes: 4},
			{lignes: 4, colonnes: 4}
		]
	},
	{
		nom: "Costa Brava",
		image: "img/Brava.png",
		largeurImage: 465,
		hauteurImage: 465,
		decoupage: [
			{lignes: 3, colonnes: 3},  
			{lignes: 3, colonnes: 5},
			{lignes: 5, colonnes: 5}
		]
	},
	{
		nom: "Venise",
		image: "img/Venise.png",
		largeurImage: 600,
		hauteurImage: 400,
		decoupage: [
			{lignes: 2, colonnes: 3}, 
			{lignes: 4, colonnes: 4}, 
			{lignes: 4, colonnes: 6}
		]
	},
	{
		nom: "Quéribus",
		image: "img/Queribus.png",
		largeurImage: 540,
		hauteurImage: 540,
		decoupage: [
			{lignes: 3, colonnes: 3},  
			{lignes: 4, colonnes: 4},
			{lignes: 5, colonnes: 5}
		]
	},
	{
		nom: "Djebel Sarho",
		image: "img/Sarho.png",
		largeurImage: 600,
		hauteurImage: 400,
		decoupage: [
			{lignes: 2, colonnes: 3},  
			{lignes: 4, colonnes: 5},
			{lignes: 4, colonnes: 6}
		]
	}
];

//============= DOM =============
var DOM = {
	effacerElement: function (pere) {
		while (pere.firstChild) {
			pere.removeChild(pere.firstChild);
		}
	},
	elementDans: function (pere, tag, args) {
		// Crée un élément dans le pere
		// fixe certains attributs
		// retourne le widget créé
		var element = document.createElement(tag);
		if (args.html) {
			element.innerHTML = args.html;
		}
		if (args.id) { 
			element.id = args.id;
		}
		if (args.type) {
			element.type = args.type;
		}
		if (args.nom) {
			element.name = args.nom;
		}
		if (args.valeur) {
			element.value = args.valeur;
		}
		if (args.checked) {
			element.checked = args.checked;
		}
		if (args.classe) {
			element.className = args.classe;
		}
		if (args.image) {
			element.setAttribute("src", args.image);
		}
		if (args.onmouseover) {
			element.setAttribute("onmouseover", args.onmouseover);
		}
		if (args.onmouseout) {
			element.setAttribute("onmouseout", args.onmouseout);
		}
		if (args.onclick) {
			element.setAttribute("onclick", args.onclick);
		}
		if (args.onchange) {
			element.setAttribute("onchange", args.onchange);
		}
		if (args.href) {
			element.setAttribute("href", args.href);
		}
		if (args.titre) {
			element.setAttribute("title", args.titre);
		}
		pere.appendChild(element);
		return element;
	}
};

//============= PZL =============
var PZL = {
	dom: {},
	// dimentions de la fenêtre
	htrMax: 0,
	lrgMax: 0,
	offsetTop: 50,
	offsetLeft: 20,
	// contrôle du jeu
	numData: 0,
	numDecoupage: 0,
	cestFini: false,
	// Durée par défaut de animation en millisecondes
	tempo: 500
};

//============= PZL.actualiserDimensionsFenetre =============
PZL.actualiserDimensionsFenetre = function () {
	// apelé par $(window).resize(PZL.actualiserDimensionsFenetre)
	PZL.htrMax = $(window).height();
	PZL.lrgMax = $(window).width();
};

//============= PZL.numeroAleatoire =============
PZL.numeroAleatoire = function (lg) {
	return Math.floor(Math.random() * lg);
};

//============= PZL.offsetAleatoire =============
PZL.offsetAleatoire = function () {
	var t, l;
	// pour placer les images au hasard à droite
	t = Math.floor(Math.random() * (PZL.htrMax - PZL.data.hauteur - 2 * PZL.offsetTop) +  PZL.offsetTop);
	l = Math.floor(Math.random() * (PZL.lrgMax - PZL.data.largeur - Math.floor(PZL.lrgMax / 2)) + Math.floor(PZL.lrgMax / 2));
	return {top: t, left: l};
};

//============= PZL.offsetCellule =============
PZL.offsetCellule = function (li, co) {
	var t, l;
	// pour découper les images dans les pièces
	t = PZL.data.hauteur * li + PZL.offsetTop;
	l = PZL.data.largeur * co + PZL.offsetLeft;
	return {top: t, left: l};
};

//============= PZL.cestLaSolution =============
PZL.cestLaSolution = function () {
	var k;
	for (k = 0; k < PZL.solution.length; k += 1) {
		if (!PZL.solution[k]) {
			return false;
		}
	}
	return true;
};

//============= PZL.nombreDePiecesOk =============
PZL.nombreDePiecesOk = function () {
	var k, n;
	n = 0;
	for (k = 0; k < PZL.solution.length; k += 1) {
		if (PZL.solution[k]) {
			n += 1;
		}
	}
	return n;
};

//============= PZL.afficherInfo =============
PZL.afficherInfo = function () {
	var n = PZL.nombreDePiecesOk();
	PZL.dom.info.innerHTML = '<b class="titre">' + PZL.data.nom + '</b> &nbsp; ' + (n > 0 ? '<span class="score">' + n + "/" + (PZL.data.lignes * PZL.data.colonnes) + '</span>' : "");
};

//============= PZL.drag =============
PZL.drag = function (event, ui) {
	PZL.solution[this.numPiece] = false;
	if (PZL.cestFini) {
		PZL.choisirUnPuzzle();
	} else {
		PZL.afficherInfo();
	}
};

//============= PZL.dureeDuJeu =============
PZL.dureeDuJeu = function () {
	var h, m, s;
	s = Math.floor((PZL.fin - PZL.debut) / 1000);
	m = Math.floor(s / 60);
	s = s % 60;
	h = Math.floor(m / 60);
	m = m % 60;
	return (h > 0 ? h + "h " : "") + (m > 0 ? m + "mn " : "") + s + "s";
};

//============= PZL.terminerEtDireBravo =============
PZL.terminerEtDireBravo = function () {
	PZL.fin = new Date().getTime();
	clearInterval(PZL.timer);
	DOM.effacerElement(PZL.dom.info);
	DOM.effacerElement(PZL.dom.chrono);
	document.body.className = "fondBravo";
	PZL.cestFini = true;
	DOM.elementDans(PZL.dom.info, "b", {classe: "bravo", html: "Bravo ! &nbsp; Puzzle terminé en " + PZL.dureeDuJeu() + " &nbsp  &nbsp "});
	DOM.elementDans(PZL.dom.info, "button", {type: "button", html: "Rejouer", onclick: "PZL.choisirUnPuzzle()"});
};

//============= PZL.recentrer =============
PZL.recentrer = function (event, ui) {
	var source = ui.draggable.get(0);
	ui.draggable.animate(this.butTopleft, PZL.tempo);
	PZL.solution[this.numPiece] = this.numPiece === source.numPiece;
	if (PZL.cestLaSolution()) {
		PZL.terminerEtDireBravo();
	} else {
		PZL.afficherInfo();
	}
};

//============= PZL.placerCellule =============
PZL.placerCellule = function (li, co, k) {
	var tl, div;
	tl = PZL.offsetCellule(li, co);
	div = DOM.elementDans(PZL.dom.page, "div", {classe: "cellule"});
	PZL.solution[k] = false;
	div.numPiece = k;
	div.butTopleft = tl;
	$(div).css("top", tl.top + "px");
	$(div).css("left", tl.left + "px");
	$(div).css("width", (PZL.data.largeur - 2) + "px");
	$(div).css("height", (PZL.data.hauteur - 2) + "px");
	$(div).droppable({hoverClass: "survol", drop: PZL.recentrer});
};

//============= PZL.placerPiece =============
PZL.placerPiece = function (li, co, k) {
	var tl, div;
	div = DOM.elementDans(PZL.dom.page, "div", {classe: "pieceImage"});
	div.numPiece = k;
	tl = PZL.offsetAleatoire();
	$(div).css("background-image", "url(" + PZL.data.image + ")");
	$(div).css("background-position", "-" + (PZL.data.largeur * co) + "px -" + (PZL.data.hauteur * li) + "px");
	$(div).css("width", PZL.data.largeur + "px");
	$(div).css("height", PZL.data.hauteur + "px");
	$(div).css("top", tl.top + "px");
	$(div).css("left", tl.left + "px");
	$(div).draggable({start: PZL.drag});
};

//============= PZL.initialiserLeJeu =============
PZL.initialiserLeJeu = function () {
	var k, li, co;
	document.title = PZL.data.nom;
	PZL.dom.info.innerHTML = '<b class="titre">' + PZL.data.nom + '</b>';
	PZL.cestFini = false;
	document.body.className = "fond";
	k = 0;
	PZL.solution = [];
	for (li = 0; li < PZL.data.lignes; li += 1) {
		for (co = 0; co < PZL.data.colonnes; co += 1) {
			PZL.placerCellule(li, co, k);
			k += 1;
		}
	}
	k = 0;
	for (li = 0; li < PZL.data.lignes; li += 1) {
		for (co = 0; co < PZL.data.colonnes; co += 1) {
			PZL.placerPiece(li, co, k);
			k += 1;
		}
	}	
};

//============= PZL.afficherChrono =============
PZL.afficherChrono = function (event) {
	PZL.fin = new Date().getTime();
	PZL.dom.chrono.innerHTML = PZL.dureeDuJeu();
};

//============= PZL.jouer =============
PZL.jouer = function (k, j) {
	PZL.debut = new Date().getTime();
	PZL.timer = setInterval(PZL.afficherChrono, 900);
	DOM.effacerElement(PZL.dom.info);
	DOM.effacerElement(PZL.dom.page);
	DOM.effacerElement(PZL.dom.chrono);
	PZL.data = DATA[k];
	PZL.data.lignes = PZL.data.decoupage[j].lignes;
	PZL.data.colonnes = PZL.data.decoupage[j].colonnes;
	PZL.data.largeur = Math.floor(PZL.data.largeurImage / PZL.data.colonnes + 0.5);
	PZL.data.hauteur = Math.floor(PZL.data.hauteurImage / PZL.data.lignes + 0.5);
	PZL.initialiserLeJeu();
};


//============= PZL.proposerPuzzle =============
PZL.proposerPuzzle = function (k, pere) {
	var j, data;
	data = DATA[k];
	DOM.elementDans(pere, "span", {classe: "blocNom", html: data.nom + " : "});
	for (j = 0; j < data.decoupage.length; j += 1) {
		DOM.elementDans(pere, "span", {html: " &nbsp "});
		DOM.elementDans(pere, "button", {type: "button", html: "(" + data.decoupage[j].lignes + "x" + data.decoupage[j].colonnes + ")" + "*****".substr(0, j + 1), onmouseover: "$(PZL.vignette[" + k + "]).fadeIn()", onmouseout: "$(PZL.vignette[" + k + "]).fadeOut()", onclick: "PZL.jouer(" + k + ", " + j + ")"});
	}
	PZL.vignette[k] = DOM.elementDans(PZL.dom.page, "img", {classe: "vignette", image: data.image});
	$(PZL.vignette[k]).css("top", (PZL.offsetTop * DATA.length - 10) + "px");
	$(PZL.vignette[k]).css("left", PZL.offsetLeft + "px");
	$(PZL.vignette[k]).hide();
};

//============= PZL.choisirUnPuzzle =============
PZL.choisirUnPuzzle = function () {
	var k, ul;
	document.title = "Puzzle";
	document.body.className = "fondChoix";
	DOM.effacerElement(PZL.dom.info);
	DOM.effacerElement(PZL.dom.page);
	PZL.vignette = [];
	DOM.elementDans(PZL.dom.info, "b", {html: "Choisir une image pour le Puzzle : "});
	ul = DOM.elementDans(PZL.dom.info, "ul", {});
	for (k = 0; k < DATA.length; k += 1) {
		PZL.proposerPuzzle(k, DOM.elementDans(ul, "li", {}));
	}
};

//============= PZL.init =============
PZL.init = function () {
	PZL.actualiserDimensionsFenetre();
	PZL.dom.info = DOM.elementDans(document.body, "div", {id: "info"});
	PZL.dom.page = DOM.elementDans(document.body, "div", {id: "page"});
	PZL.dom.chrono = DOM.elementDans(document.body, "div", {id: "chrono"});
	$(window).resize(PZL.actualiserDimensionsFenetre);
	PZL.choisirUnPuzzle();
};

