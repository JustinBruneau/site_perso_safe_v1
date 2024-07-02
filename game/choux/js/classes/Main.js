"use strict";

class Main {
    // Ajoutez cette fonction ici, après la déclaration de la classe Main
    function submitScore(nom, score) {
        const formData = new FormData();
        formData.append('nom', nom);
        formData.append('score', score);

        fetch('scores.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            // Mettre à jour le tableau des scores
            fetchScores();
        })
        .catch(error => console.error('Erreur:', error));
    }

    /**
     * CONSTRUCTEUR DU JEU GNOME
     * @param tps0 Compte à rebourd
     * @param score0 Score du joueur
     * @param QteMonstres La quantité de monstres à charger
     * @param QteBombes La quantité de bombes à charger
     */
    constructor(tps0, score0, QteMonstres, QteBombes) {
        // ... Le reste du constructeur
    }

    // ... Les autres méthodes

    /**
     * BOUCLE DU JEU
     */
    maj() {
        // VIDER
        this.clear();

        console.log(this.tps);
        // FOND HORS/INTRO JEU
        if (this.tps <= 0 || this.enAttente) {
            this.ctx.globalAlpha = 0.3;
        }

        this.ctx.drawImage(this.plateau.getFond(), 0, 0, this.plateau.getWidth(), this.plateau.getHeight());

        // COLLISIONS
        this.collisions();

        // DESSINS DES ELEMENTS
        for (let i = 0; i < this.niveau.length; i++) {
            if (this.niveau[i].isVisible()) this.ctx.drawImage(this.niveau[i].getImage(), this.niveau[i].getPositionX(), this.niveau[i].getPositionY(), this.niveau[i].getW(), this.niveau[i].getH());
        }

        // RETIRER L'OPACITE SI BESOIN
        this.ctx.globalAlpha = 1;

        // HERO
        this.hero.deplacer();
        this.hero.contenu();
        if (this.tps > 0) this.ctx.drawImage(this.hero.getImage(), this.hero.getPositionX(), this.hero.getPositionY(), this.hero.getW(), this.hero.getH());

        // SCORE
        this.tourne ?
            this.animerTxtScore() :
            this.ctx.fillText((this.scoreAffiche < parseInt(this.score, 10) ? this.ajouter() : this.afficher()), this.police * 4, this.hero.getH() * 2);

        // IMG SCORE
        let lineW = this.ctx.measureText(this.score).width / 2;
        let lineH = this.ctx.measureText("8").width;
        this.ctx.font = (this.police / 1.5).toString() + "px FontAwesome";
        // FAIRE TOURNER LA CUILLERE
        this.ctx.save();
        if (this.tourne) {
            this.ctx.translate(this.police * 4 + lineW + lineH / 3, (this.hero.getH() * 2) - lineH / 8);
            this.ctx.rotate(this.angle > 360 ? this.angle = 0 : this.angle++);

        } else {
            this.ctx.translate(this.police * 4 + lineW, (this.hero.getH() * 2) - lineH / 8);
            this.ctx.rotate(0);
        }
        this.ctx.translate(-(this.police * 4 + lineW), -((this.hero.getH() * 2) - (lineH) / 8));
        // LA CUILLERE
        this.tourne ?
            this.ctx.fillText("\uf1b1", this.police * 4 + lineW, (this.hero.getH() * 2) - lineH / 8) :
            this.ctx.fillText("   \uf1b1", this.police * 4 + lineW, (this.hero.getH() * 2) - lineH / 8);
        this.ctx.restore();
        // CHANGER LA FONTE
        this.ctx.font = (this.police).toString() + "px Amatic";
        // INTRO OU GAGNE OU PERDU? + MEMORISATION
        if (this.NbreMontres === 0) {
            this.tps = "0";
            this.audio.getStopVite();
            this.ctx.fillText("* GAGNÉ ! *", this.w / 2, this.h / 2.5);
            this.ctx.fillText("espace pour démarrer", this.w / 2, this.h - this.hero.getH());
            this.ctx.fillText(this.getStorage(), this.w / 2, this.h / 2);
            this.gagne = true;
            this.setStorage();

            // Appeler submitScore lorsque le joueur gagne
            submitScore('Joueur1', this.score); // Remplacez 'Joueur1' par la variable contenant le nom du joueur

        } else if (this.tps === this.car) {
            this.ctx.fillText("RÉCUPÉREZ LES CHOUX !", this.w / 2, this.h / 2);
            this.ctx.font = (this.police).toString() + "px FontAwesome";
            let lineHeight = this.ctx.measureText('\uf150').width * 1.2;
            this.ctx.fillText('\uf151', this.w / 2, this.h - this.hero.getH() - lineHeight * 3);
            this.ctx.fillText('\uf191 \uf150 \uf152', this.w / 2, this.h - this.hero.getH() - lineHeight * 2);
            this.ctx.font = (this.police).toString() + "px Amatic";
            this.ctx.fillText('appuyez pour démarrer', this.w / 2, this.h - this.hero.getH());
        } else if (this.tps <= 0) {
            this.audio.getStopVite();
            this.hero.setVisible(false);
            this.msgIntro();
            this.gagne = false;
        }
        // CPTE A REBOURD
        else if (this.tps > 0) {
            this.ctx.fillText(this.tps, this.w - this.police * 3, this.hero.getH() * 2);
        }
    }

    /**
     * INCRÉMENTER LE SCORE
     */
    ajouter() {
        this.tourne = true;
        this.audio.getScore();
        return (this.scoreAffiche += 20).toString();
    }

    /**
     * AFFICHER LE SCORE
     */
    afficher() {
        this.tourne = false;
        return this.score;
    }

    /**
     * Animer le texte du score
     */
    animerTxtScore() {
        this.ScaledPolice > this.police * 1.2 ? this.ScaledPolice = this.police : this.ScaledPolice += 2;
        this.scoreAffiche > parseInt(this.score - 100, 10) ?
            this.ctx.font = (this.ScaledPolice).toString() + "px Amatic" :
            this.ctx.font = (this.police).toString() + "px Amatic";
        return this.ctx.fillText((this.scoreAffiche < parseInt(this.score, 10) ? this.ajouter() : this.afficher()), this.police * 4, this.hero.getH() * 2);
    }

    /**
     * Afficher les règles après 3 secondes
     */
    msgIntro() {
        let o = this;
        if (this.timerMsgRegles === undefined) this.timerMsgRegles = setTimeout(
            function () {
                o.affMsgRegles = 1;
            }, 3000);
        if (this.affMsgRegles === 0) {
            let lineHeight = this.ctx.measureText('\uf150').width * 1.2;
            this.ctx.fillText("PERDU", this.w / 2, this.h / 2);
            this.ctx.fillText(this.getStorage(), this.w / 2, (this.h / 2) + lineHeight * 2);
        } else {
            this.ctx.fillText("RÉCUPÉREZ LES CHOUX !", this.w / 2, this.h / 2);
            this.ctx.font = (this.police).toString() + "px FontAwesome";
            let lineHeight = this.ctx.measureText('\uf150').width * 1.2;
            this.ctx.fillText('\uf151', this.w / 2, this.h - this.hero.getH() - lineHeight * 3);
            this.ctx.fillText('\uf191 \uf150 \uf152', this.w / 2, this.h - this.hero.getH() - lineHeight * 2);
            this.ctx.font = (this.police).toString() + "px Amatic";
            this.ctx.fillText("espace pour démarrer", this.w / 2, this.h - this.hero.getH());
        }
    }


    /**
     * LES COLLISIONS DANS LE JEU
     */
    collisions() {
        for (let i = 0; i < this.niveau.length; i++) {
            // COLLISION ELEMENT
            if (this.intersects(this.hero, this.niveau[i])) {
                // COLLISION CHOU
                if (this.niveau[i].type() === "chou") {
                    this.niveau[i].setVisible(false);
                    this.NbreMontres -= 1;
                    this.addScore(200);
                    if (this.NbreMontres === 0) {
                        this.stopExChou();
                        // AUDIO
                        this.audio.getGagne();
                        this.addScore(this.tps * 60);
                        // FAIRE UNE PAUSE SI GAGNÉ
                        this.pauseMobile = true;
                        /**
                         * CHANGER FOND + EFFET WAOUH
                         */
                        this.waouh();
                    }
                } else if (this.niveau[i].type() === "chouBacalan") {
                    this.niveau[i].setVisible(false);
                    this.NbreMontres -= 1;
                    this.addScore(300);
                    this.audio.getExChou();
                    this.extraChou();
                    this.extra();
                    if (this.NbreMontres === 0) {
                        this.stopExChou();
                        // AUDIO
                        this.audio.getGagne();
                        this.addScore(this.tps * 60);
                        // FAIRE UNE PAUSE SI GAGNÉ
                        this.pauseMobile = true;
                        /**
                         * CHANGER FOND + EFFET WAOUH
                         */
                        this.waouh();
                    }
                }
                // COLLISION MAIRE
                else if (this.normal && this.niveau[i].type() === "maire") {
                    // FAIRE UNE PAUSE SI PERDU
                    if (this.tps > 0) {
                        this.stopExChou();
                        this.perdu();
                        this.hero.setVisible(false);
                        this.pauseMobile = true;
                        this.audio.getPb();
                        this.audio.getPerdu();
                        this.tps = 0;
                        this.lgScore = 2500;
                    }
                }
            }
        }
    }

    /**
     * AFFICHER LES MESSAGES
     */
    leTexte() {

        this.ctx.font = (this.police).toString() + "px Amatic, cursive";

        // CRÉER LE GRADIENT
        let gradient = this.ctx.createLinearGradient(0, 0, this.plateau.getWidth(), 0);
        // VERT
        gradient.addColorStop("0", "#56FF6D");
        // JAUNE
        gradient.addColorStop("1.0", "#E8D542");
        // MAUVE D090FF
        this.ctx.fillStyle = gradient;
        this.ctx.textAlign = "center";
        this.ctx.shadowColor = 'black';
        this.ctx.shadowOffsetX = -1;
        this.ctx.shadowOffsetY = 1;
    }


    /**
     * AJOUTER AU SCORE + MEMORISER LE SCORE A RETIRER SI RELANCE
     * @param aAjouter Permet d'ajouter une valeur au score
     */
    addScore(aAjouter) {
        let sc = parseInt(this.score, 10);
        sc = sc + aAjouter;
        this.score = sc.toString();

        if (sc > this.lgScore) {
            this.lgScore += 2500;
            this.audio.getOk();
        }

        sc = parseInt(this.scoreTemporaire, 10);
        sc = sc + aAjouter;
        this.scoreTemporaire = sc.toString();

    }

    /**
     * RETIRER AU SCORE
     * @param aRetirer Permet de retirer une valeur au score
     */
    retScore(aRetirer) {
        this.stopExChou();
        let sc = parseInt(this.score, 10);
        sc = sc - aRetirer;
        this.score = sc.toString();
    }

    /**
     * RETIRER 1 SECONDE + FAIRE VITE + SAVOIR SI C'EST DEMMARÉ
     */
    tempo() {    
        let sc = parseInt(this.tps, 10);
        sc -= 1;
        this.tps = sc.toString();
        // FAIRE VITE !
        if (!this.vite && this.tps < 6) {
            this.vite = true;
            this.audio.getStartVite();
        } else if (this.tps == 0) {
            this.audio.getPerdu();
            this.timeup();
        }
        // DEMARRAGE ?
        if(this.enAttente)this.enAttente=false;
    }

    /**
     * VIDER LE CONTENU DU CANVA
     */
    clear() {
        this.ctx.clearRect(0, 0, this.plateau.getWidth(), this.plateau.getHeight());
    }

    /**
     * ÉCOUTEUR CLAVIER DU HERO
     * @param o L'objet écouté
     */
    clavier(o) {
        const can = o.plateau.getCanvas();
        // ÉCOUTEURS MOBILE BOUGE
        can.addEventListener('touchmove', function (e) {
            e.preventDefault();
            if ((o.tps == o.car || o.tps <= 0) && !o.pauseMobile) {
                // SI GAGNÉ => NOUVEAU NIVEAU
                if (o.gagne) {
                    o.nouveauNiveau();
                }
                o.hero.setVisible(true);
                o.NbreMontres = o.QteMonstres;
                o.tps = o.car;
                o.vite = false;
                o.raz();
                o.recharger();
            } else {
                // SAVOIR l'ORIENTATION DU MOBILE
                let orientation = screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type;               // ITÉRER À TRAVERS LES POINTS DE CONTACT QUI ONT BOUGÉ.
                for (let i = 0; i < e.changedTouches.length; i++) {

                    if (orientation === "portrait-secondary" || orientation === "portrait-primary" || orientation === undefined) {
                        // RÉCUPÉRER LA POSITION
                        o.hero.setPositionX(e.changedTouches[i].pageX - o.hero.getW() / 2);
                        o.hero.setPositionY(e.changedTouches[i].pageY - o.hero.getH() / 2);
                    } else {
                        // RÉCUPÉRER LA POSITION
                        o.hero.setPositionX(e.changedTouches[i].pageX - o.hero.getW() * 3);
                        o.hero.setPositionY(e.changedTouches[i].pageY - o.hero.getH());
                    }
                }
            }
            e.stopPropagation();

        }, { passive: false });
        // ÉCOUTEURS MOBILE NE BOUGE PLUS
        can.addEventListener('touchend', function (e) {
            e.preventDefault();
            // GÉRER LES PAUSES QUAND C'EST PERDU OU GAGNÉ
            if (o.pauseMobile) o.pauseMobile = false;
            e.stopPropagation();
        }, { passive: false });

        // ÉCOUTEURS MOBILE COMMENCE À BOUGER
        can.addEventListener('touchstart', function (e) {
            e.preventDefault();
            // REGLES DU JEU & POUR CHROME CHARGEMENT DE LA MUSIQUE
            if (o.timer === undefined) {
                // CPTE A REBOURD 1S
                o.timer = setInterval(function () {
                    o.tempo();
                }, 1000);
                o.audio.getMusique();
            }
            e.stopPropagation();
        }, { passive: false });


        // ÉCOUTEURS CLAVIER
        document.addEventListener("keydown", function (evt) {
            evt.preventDefault();
            // AJOUTER DE LA VÉLOCITÉ
            if (o.touche == evt.keyCode) {
                o.hero.veloPlus();
            } else {
                o.touche = evt.keyCode;
                o.hero.veloRAZ();
            }
            // REGLES DU JEU & POUR CHROME CHARGEMENT DE LA MUSIQUE
            if (o.timer === undefined) {
                // CPTE A REBOURD 1S
                o.timer = setInterval(function () {
                    o.tempo();
                }, 1000);
                o.audio.getMusique();
            }
            if (o.tps >= 0) {
                if (evt.keyCode === 37) {
                    o.hero.gauche(true);
                }
                if (evt.keyCode === 39) {
                    o.hero.droite(true);
                }
                if (evt.keyCode === 38) {
                    o.hero.haut(true);
                }
                if (evt.keyCode === 40) {
                    o.hero.bas(true);
                }
            }
            // APPUYER SUR ESPACE POUR RELANCER PENDANT 5 SEC.
            if (evt.keyCode === 32 && (o.tps > o.car - 5 || o.tps <= 0)) {
                // RETIRE LE SCORE COURANT SI LA PARTIE EST COMMENCEE
                if (o.tps > o.car - 5) {
                    o.retScore(o.scoreTemporaire);
                }
                // SI GAGNÉ => NOUVEAU NIVEAU
                if (o.gagne) {
                    o.nouveauNiveau();
                }
                o.hero.setVisible(true);
                o.NbreMontres = o.QteMonstres;

                o.tps = o.car;
                o.vite = false;
                o.raz();
                o.recharger();
            }
        });
        document.addEventListener("keyup", function (evt) {
            // AJOUTER DE LA VÉLOCITÉ ?
            if (o.touche === evt.keyCode) {
                o.hero.veloPlus();
            } else {
                o.touche = evt.keyCode;
                o.hero.veloRAZ();
            }
            if (evt.keyCode === 37) o.hero.gauche(false);
            if (evt.keyCode === 39) o.hero.droite(false);
            if (evt.keyCode === 38) o.hero.haut(false);
            if (evt.keyCode === 40) o.hero.bas(false);
        })
    }


    /**
     * ALGORITHME DES COLLISIONS ENTRE DEUX OBJETS VISIBLES
     * @param a Objet a
     * @param b Objet b
     */
    intersects(a, b) {
        if (a.isVisible() && b.isVisible()) {
            let x1 = Math.max(a.left(), b.left());
            let x2 = Math.min(a.right(), b.right());
            let y1 = Math.max(a.top(), b.top());
            let y2 = Math.min(a.bottom(), b.bottom());
            return (x1 < x2 && y1 < y2);
        } else return false;
    }

    /**
     * RAZ DU JEU + SCORE TEMPORAIRE SI OK + STOCKAGE DU MEILLEUR SCORE
     */
    raz() {
        this.hero.init();
        for (let i = 0; i < this.niveau.length; i++) {
            this.niveau[i].setVisible(true);
        }
        if (this.gagne) {
            this.scoreTemporaire = 0;
        } else {
            this.score = "0";
            this.scoreAffiche = 0;
            this.premierNiveau();
        }
        this.audio.getStopVite();
    }

    /**
     * LANCER L'EFFET CSS INTRO
     */
    intro() {
        this.plateau.getCanvas().classList.remove("intro");
        this.plateau.getCanvas().offsetWidth;
        this.plateau.getCanvas().classList.add("intro");
    }

    /**
     * LANCER L'EFFET CSS WAOUH
     */
    waouh() {
        this.plateau.getCanvas().classList.remove("rebond");
        this.plateau.getCanvas().classList.remove("intro");
        this.plateau.getCanvas().classList.remove("wow");
        this.plateau.getCanvas().classList.remove("perdu");
        this.plateau.getCanvas().classList.remove("extra");
        this.plateau.getCanvas().offsetWidth;
        this.plateau.getCanvas().classList.add("wow");
        clearInterval(this.fps);
        let i = this.plateau.getIFond();
        let j = i;
        while (j === i) {
            j = this.getRandomInt(this.ttImages);
        }
        this.plateau.setFond(j)
        this.boucle(this);
    }

    /**
     * LANCER L'EFFET CSS PERDU
     */
    perdu() {
        this.plateau.getCanvas().classList.remove("extra");
        this.plateau.getCanvas().classList.remove("rebond");
        this.plateau.getCanvas().classList.remove("intro");
        this.plateau.getCanvas().classList.remove("perdu");
        this.plateau.getCanvas().offsetWidth;
        this.plateau.getCanvas().classList.add("perdu");
    }

    /**
     * LANCER L'EFFET CSS TEMPS ÉCOULÉ
     */
    timeup() {
        this.plateau.getCanvas().classList.remove("extra");
        this.plateau.getCanvas().classList.remove("rebond");
        this.plateau.getCanvas().classList.remove("intro");
        this.plateau.getCanvas().classList.remove("perdu");
        this.plateau.getCanvas().offsetWidth;
        this.plateau.getCanvas().classList.add("rebond");
    }

    /**
     * LANCER L'EFFET CSS EXTRA CHOU
     */
    extra() {
        this.plateau.getCanvas().classList.remove("extra");
        this.plateau.getCanvas().classList.remove("rebond");
        this.plateau.getCanvas().classList.remove("intro");
        this.plateau.getCanvas().classList.remove("perdu");
        this.plateau.getCanvas().offsetWidth;
        this.plateau.getCanvas().classList.add("extra");
    }

    

    /***
     * Rendre invincible 5 secondes
     */
    extraChou() {
        this.normal = false;
        let o = this;
        this.clignote = setInterval(
            function () {
                o.hero.getIndiceImage() === 0 ? o.hero.setIndiceImage(1) : o.hero.setIndiceImage(0);
            }, 100);
        this.exChou = setTimeout(
            function () {
                o.normal = true;
                clearInterval(o.clignote);
                o.hero.setIndiceImage(0);
            }, 5000);
    }

    /**
     * STOP L'EXTRA CHOU
     */
    stopExChou() {
        // STOP EXTRA CHOU
        clearTimeout(this.exChou);
        clearInterval(this.clignote);
        this.normal = true;
        this.hero.setIndiceImage(0);
    }

    /**
     * ALGORITHME QUI RETOURNE UN ENTIER ALEATOIRE ENTRE 0 ET MAX-1
     * @param max Valeur maximale non comprise
     */
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    /***
     * SAUVEGARDER LE SCORE MAX EN PRENANT EN COMPTE LE RETOUR
     */
    setStorage() {
        try {
            if (typeof localStorage === 'undefined') {
                return "Soupes non enregistrées";
            } else {
                if (this.score === "0") {
                } else {
                    if (this.getStorage() === "Pas de soupes enregistrées") {
                        window.localStorage.setItem("choux", parseInt(this.score, 10));
                    } else if (parseInt(localStorage.getItem("choux"), 10) < parseInt(this.score, 10)) window.localStorage.setItem("choux", this.score);
                }
            }
        } catch (e) {
            return "Soupes non enregistrées";
        }
    }


    /***
     * RÉCUPÉRER LE SCORE MAX
     */
    getStorage() {
        try {
            if (typeof localStorage === 'undefined') {
                return "Soupes non enregistrées";
            } else {
                let retour = window.localStorage.getItem("choux");

                if (retour === null) return "Pas de soupes enregistrées";
                else if (retour === this.score || parseInt(retour, 10) === parseInt(this.score, 10) - this.scoreTemporaire) {
                    return "Votre record est de " + retour + " soupes"
                } else return "Le record est de " + retour + " soupes";
            }
        } catch (e) {
            return "Soupes non enregistrées";
        }
    }
}

