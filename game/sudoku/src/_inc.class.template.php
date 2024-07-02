<?php
/*************************************************************************************************************************************/
/* ********************** Templates Class ********************************************************************************************/
/*************************************************************************************************************************************/
class template 
{
    var $Container;
    var $Key = array();
    var $blocs = array();
    var $ValueVar = array();
    var $mode = 'debug';
    var $buffer = FALSE; //public
    var $BufferFolder;
    var $PrintPage;  // Déclaration de la propriété PrintPage

    function __construct() 
    {
        $this->Container = "";
        $this->Key = array();
        $this->ValueVar = array();
    }

    function AddTemplate($TPL) 
    {
        // On vérifie que le fichier template existe
        $this->Container = $TPL;
    }

    function assign($cle, $valeur) 
    {
        $cle = $this->ajouteAccolade($cle);
        array_push($this->Key, $cle);
        array_push($this->ValueVar, $valeur);
    }

    function ajouteAccolade($val) 
    {
        return "[".$val."]";
    }

    function PrintPage($TPL)
    {
        if ($this->Container == '') {
            $this->AddTemplate($TPL);
        } // Si le fichier est déjà chargé

        $fin_bloc = array_keys($this->blocs);
        $i = 0;
        // La boucle est exécutée tant qu'il reste des clefs à traiter dans l'array
        while (array_key_exists($i, $fin_bloc)) {
            $j = $i - 1;
            // Si $sous_blocs est à true et qu'il existe un sous-bloc, on le traite
            if ($j > -1 and $sous_blocs = true) {
                $this->blocs[$fin_bloc[$i]] =
                    preg_replace('!<\!--' . $fin_bloc[$j] . '-->(.+)<\!--/' . $fin_bloc[$j] . '-->!isU',
                        $this->blocs[$fin_bloc[$j]], $this->blocs[$fin_bloc[$i]]);
            }

            // On traite le bloc lui-même
            $this->Container = preg_replace('!<\!--' . $fin_bloc[$i] . '-->(.+)<\!--/' . $fin_bloc[$i] . '-->!isU',
                $this->blocs[$fin_bloc[$i]], $this->Container);
            //$this->Container = str_replace($fin_bloc[$i]), array_values($this->var), $this->Container);

            // On supprime tous les commentaires !
            $this->Container = str_replace('<!--' . $fin_bloc[$i] . '-->', '', $this->Container);
            $this->Container = str_replace('<!--/' . $fin_bloc[$i] . '-->', '', $this->Container);
            $i++;
        }

        $this->Container = str_replace($this->Key, $this->ValueVar, $this->Container);

        $res = $this->Container;
        $this->Container = "";
        $this->PrintPage = "";
        $this->Key = array();
        $this->ValueVar = array();
        return $res;
    }

    function bloc($bloc, $array, $TPL, $IFBloc = false)
    {
        $this->AddTemplate($TPL);  
        // On vérifie que le bloc existe dans le fichier template
        if (preg_match('<!--'.$bloc.'-->', $this->Container) and preg_match('<!--/'.$bloc.'-->', $this->Container)) { 
            $pattern = '/<!--' . preg_quote($bloc, '/') . '-->(.*?)<!--\/' . preg_quote($bloc, '/') . '-->/s';
            if (preg_match($pattern, $this->Container, $contenu_bloc_tableau)) {
                $contenu_bloc = $contenu_bloc_tableau[0];
                // $contenu_bloc contient la correspondance complète
            } else {
                // Le motif n'a pas été trouvé
                $contenu_bloc = ''; // ou toute autre valeur par défaut
            }
            $i = 1;
            /* On traite toutes les clefs et les valeurs de $array pour les mettre dans
            deux tableaux associatifs distincts */
            foreach ($array as $key => $val) {
                // On vérifie à chaque fois que la variable se trouve bien dans dans l'array
                if (preg_match($this->ajouteAccolade($key), $this->Container)) {
                    $cle[$i] = $this->ajouteAccolade($key);
                    $valeur[$i] = $val;
                    $i++;
                }
            }
            // On remplace toutes les variables du bloc par leur contenu
            $bloc_final = str_replace($cle, $valeur, $contenu_bloc);
            
            if (isset($this->blocs[$bloc])) {
                // Si le bloc existe, on insère la partie qu'on vient de traiter
                $this->blocs[$bloc] .= $bloc_final;
            } else {
                // Sinon, on en créé un nouveau
                $this->blocs[$bloc] = $bloc_final;
            }
        } else if ($this->mode == 'debug') {
            echo 'ERREUR bloc. Le bloc "'.$bloc.'" n\'existe pas sur le fichier template : '.$file;
            die();
        }
    } 

    function clear()
    {
        unset($this->Container, $this->Key, $this->ValueVar);
    }
}
?>
