<?php
header("Cache-Control: no-cache, must-revalidate"); 
header('Content-type: application/javascript'); 
?>
var timing_game;
var parametres;

var startTime = 0;
var start = 0;
var end = 0;
var diff = 0;
var totalsec=0;
var timerID = 1;
function chrono(){
	end = new Date();
	diff = end - start;
	diff = new Date(diff);
	var msec = diff.getMilliseconds();
	var sec = diff.getSeconds();
	totalsec=diff.getSeconds()+(60*diff.getMinutes())+(60*(diff.getHours()-1));
	var min = diff.getMinutes();
	var hr = diff.getHours()-1;
	if (min < 10){
		min = "0" + min;
	}
	if (sec < 10){
		sec = "0" + sec;
	}
	if(msec < 10){
		msec = "00" +msec;
	}
	else if(msec < 100){
		msec = "0" +msec;
	}
$("#chronotime").html( hr + ":" + min + ":" + sec);
	//document.getElementById("").innerHTML = hr + ":" + min + ":" + sec;
	if(startTime==1)
	timerID = setTimeout("chrono()", 10);
}
function chronoStart(){

	start = new Date();
	startTime=1;
	chrono();
}

function chronoContinue(){

	start = new Date()-diff;
	start = new Date(start);
	chrono();
}
function chronoReset(){
$("#chronotime").html("0:00:00");
	//document.getElementById("chronotime").innerHTML = "0:00:00";
	start = new Date();
}
function chronoStopReset(){
$("#chronotime").html("0:00:00");

}
function StopChrono(){

	clearTimeout(timerID);
startTime=0;
}


var type='numeros';
function getXDomainRequest() 
{
	var xdr = null;
	if (window.XDomainRequest) {
	  xdr = new XDomainRequest();
	} else if (window.XMLHttpRequest) {
	  xdr = new XMLHttpRequest();
	} else {
	  alert("Impossible de gérer le XSS...");
	}
	return xdr;
}

(function($)
{       
$.fn.PhpSudo=function(options)
    {
	   var defauts=
           {
		"AfficheSelectionGrilles":true, //menu de selection des grilles
		"AfficherLaGrille":true,
		"GenererNouvelleGrille":'false',
        "TailleCasePX": "32",
        "TailleTexte": "16",
 		"Couleurchiffres": "#000",
		"Couleurgrille": "#000",
		"couleucaseSolution": "#000",
		"Niveau":"0", // de 0 à 2
		"Dimension":"4*2", //4*2, 6*3, 9*3... le modulo doit être = à 0 //ajout protection contre trop grosses grilles		
		"Type":"numeros"
          };  
        parametres=$.extend(defauts, options); 
        return this.each(function()
	{

		switch(parametres.Dimension)
		{
			case '4*2' :
			dimension=0;
			break;

			case '6*3' :
			dimension=1;
			break;

			case '8*4' :
			dimension=2;
			break;

			case '9*3' :
			dimension=3;
			break;

			case '10*5' :
			dimension=4;
			break;

			case '12*3' :
			dimension=5;
			break;

			case '14*7' :
			dimension=6;
			break;

			case '16*4' :
			dimension=7;
			break;
		}
		niveau=parametres.Niveau;

		if(dimension=='16*4') dimension=7;		
		action='dimension='+parametres.Dimension+'&type='+parametres.Type+'&niveau='+parametres.Niveau+'&newgrille='+parametres.GenererNouvelleGrille;

	$("#grille").html('<div style="margin-left:auto;margin-right:auto;text-align:center;margin-top:10px;background:#fff;width:150px;border:1px solid #ECE9EA;height:130px;z-index:1; text-align:center;border-radius: 10px;" id="waiting"><br /><br /><img src="imgs/ajax-loader.gif" border="0" width="40" height=40" style="margin-top:5px;" /></div>');


var xdr = getXDomainRequest();
xdr.onload = function() {
if(xdr.responseText!='TIMEOUT')
{
	$("#grille").html(xdr.responseText);
	document.getElementById('dimension').selectedIndex=dimension ;
	document.getElementById('niveau').selectedIndex=niveau ;
	document.getElementById('type').selectedIndex=type ;
	
		if(parametres.AfficheSelectionGrilles)
			$('#selectiongrille').css('display','block');
		else
			$('#selectiongrille').css('display','none');
		if(!parametres.AfficherLaGrille)
		{
			parametres.Dimension='4*2';
			parametres.Niveau='0';
			$('#bloc_grille').css('display','none');
			$('#bloc_options').css('display','none');
		}
		else
		{
			$('#bloc_grille').css('display','block');
			$('#bloc_options').css('display','block');
		}
		 /* aspect de la grille */
 		 $('.GrilleCSS').css('width',parametres.TailleCasePX+'px');
		 $('.GrilleCSS').css('font-size',parametres.TailleTexte+'px');
		 $('.GrilleCSS').css('margin','0px');
		 $('.GrilleCSS').css('margin-right','-5px');
		 $('.GrilleCSS').css('height',parametres.TailleCasePX+'px');
		 $('.GrilleCSS').css('font-family','arial');
		 $('.GrilleCSS').css('vertical-align','middle');
		 $('.GrilleCSS').css('text-align','center');
 		 $('.GrilleCSS').css('color',parametres.Couleurchiffres);
 		 $('.TopCase').css('border-top','3px solid '+parametres.Couleurgrille);
 		 $('.BottomCase').css('border-bottom','3px solid '+parametres.Couleurgrille);
 		 $('.RightCase').css('border-right','3px solid '+parametres.Couleurgrille);
  		 $('.LeftCase').css('border-left','3px solid '+parametres.Couleurgrille);
  		 $('.BorderLeft').css('border-left','1px solid '+parametres.Couleurgrille);
 		 $('.BorderTop').css('border-top','1px solid '+parametres.Couleurgrille);
  		 $('.BorderBottomNull').css('border-bottom','0px solid '+parametres.Couleurgrille);
  		 $('.BorderRightNull').css('border-right','0px solid '+parametres.Couleurgrille);
		 $('.Disabled').css('background',' #ccc');
   		 $('.Disabled').css('cursor',' default');
   		 $('.Disabled').css('color',' #999');
   		 $('.AlignGrille').css('margin-left','auto');
   		 $('.AlignGrille').css('margin-right','auto');
   		 $('.AlignGrille').css('text-align','center');
   		 $('.AlignGrille').css('font-family','arial');
   		 $('.FormGrille').css('text-align','center');
		 $('.FormGrille input').css('text-transform','capitalize');
		 $('.GrilleCSS[disabled]').css('color','black');
		 $('.GrilleCSS[readonly]').css('color','black');
		 $('.GrilleCSS[readonly]').css('background','#ccc');
  		 $('.Disabled').css('color','black');
         $('.Disabled').css('background','#ccc');
   		 $('.options').css('font-family','arial');
   		 $('.options').css('font-size','12px');
		 parametres.AfficherLaGrille=true;
	chronoReset();
	chronoStart();
}
else
	$("#grille").PhpSudo(parametres);
}


xdr.open("GET", "src/phpsudo.php?"+action+'&'+<?php echo time(); ?>);
xdr.send();	 
	 });                         
    };
})(jQuery);

function GetSudoku(parametres)
{ 
	
	$("#grille").PhpSudo(parametres);
}

function GetSudokuNew()
{

	parametres.Dimension=$("#dimension").val();
	parametres.Niveau=$("#niveau").val();
	parametres.Type=$("#type").val();
	dimension=document.getElementById('dimension').selectedIndex ;
	niveau=document.getElementById('niveau').selectedIndex ;
	type=document.getElementById('type').selectedIndex ;
	GetSudoku(parametres);

}

function SetCookie (name, value) {
	var argv=SetCookie.arguments;
	var argc=SetCookie.arguments.length;
	var expires=(argc > 2) ? argv[2] : null;
	var path=(argc > 3) ? argv[3] : null;
	var domain=(argc > 4) ? argv[4] : null;
	var secure=(argc > 5) ? argv[5] : false;
	document.cookie=name+"="+escape(value)+
		((expires==null) ? "" : ("; expires="+expires.toGMTString()))+
		((path==null) ? "" : ("; path="+path))+
		((domain==null) ? "" : ("; domain="+domain))+
		((secure==true) ? "; secure" : "");
}
function getCookieVal(offset) {
	var endstr=document.cookie.indexOf (";", offset);
	if (endstr==-1)
      		endstr=document.cookie.length;
	return unescape(document.cookie.substring(offset, endstr));
}
function GetCookie (name) {
	var arg=name+"=";
	var alen=arg.length;
	var clen=document.cookie.length;
	var i=0;
	while (i<clen) {
		var j=i+alen;
		if (document.cookie.substring(i, j)==arg)
                        return getCookieVal (j);
                i=document.cookie.indexOf(" ",i)+1;
                        if (i==0) break;}
	return null;
}



function verif_grille()
{
	erreur=0;
	message='';
		for(i=0;i<16;i++)
		{
			for(j=0;j<16;j++)
			{
			position=i+'_'+j;
			if(document.getElementById('id_'+position) && (document.getElementById('id_'+position).readonly!=true) ) 
			{
			
			valeur=document.getElementById('id_'+position).value;
			if($('#idSol_'+position).val()!=valeur.toUpperCase() && $('#id_'+position).val()!="")		
			{
				erreur++;
		
			}
			if(document.getElementById('id_'+position) && $('#id_'+position).val()=='')
				message="\n"+'Il faut remplir toutes les cases !';
			}			
			}
		}
	if(erreur>0 || message!='')
	alert ('Votre grille comporte '+erreur+' erreur(s)'+message);

	if(erreur==0 && message=='')
	{
		 StopChrono();
		 $('#options_grille').css('display','none');
		 $('#valider').css('display','none');

		var msg_felicitation='Bravo, la grille est valide !!!'

		
		

		// on teste si cookie present sur le pc

		// on compare ancien score pour le type de grille

		// si mieux on informe utilisateur

		// sinon informe que la dernière fois c'etait mieux		
		
		//on enregistre le score sur un cookie
		// si pas de cookie 
		

		if (navigator.cookieEnabled) // le navigateur accepte les cookies
		{
			// on teste si un cookie existe
			var date_exp = new Date();
			date_exp.setTime(date_exp.getTime()+(365*24*3600*1000)); // dans 1 an
		

		
			var NOMcookie=$('#dimgrillephpsudo').val()+'|'+$('#niveaugrillephpsudo').val()+'|'+type;
			var tmps=totalsec;
			var ancien_record=GetCookie(NOMcookie);
			if(ancien_record!=null && ancien_record>tmps)
			{
			
				SetCookie(NOMcookie,tmps,date_exp,'PhpSudo');
				msg_felicitation=msg_felicitation+"\n"+"Vous avez progress\351, votre meilleur temps était de "+ancien_record+" secondes pour ce type de grille. "+"\n\n"+"Nouveau record : "+tmps+" secondes";
			}
			else 
			if(ancien_record==null)
			{
				SetCookie(NOMcookie,tmps,date_exp,'PhpSudo');
			}
			else if(ancien_record<tmps)
			{
				// vous n'avez pas fais un meilleur temps
				msg_felicitation=msg_felicitation+"\n"+"Mais vous n'avez pas progress\351, votre meilleur temps est de "+ancien_record+" secondes pour ce type de grille. ";
			}


			//alert(txt);

		}

		alert (msg_felicitation);


	}
}
function affiche_solution()
{
	for(i=0;i<16;i++)
	{
		for(j=0;j<16;j++)
		{
			
			
			ident='id_'+i+'_'+j;
			if(document.getElementById(ident) && (document.getElementById(ident).readOnly!=true) ) 
			{
				////if($('#'+ident).val()!='')
				//{
						//if(!auto_verif($('#'+ident).val(),i+'_'+j))
				//auto_verif($('#'+ident).val(),i+'_'+j);
							//$('#'+ident).val()=$('#idSol_'+i+'_'+j).val();
				//}
				//else //la case est vide
				//{
				document.getElementById(ident).value=document.getElementById('idSol_'+i+'_'+j).value;
				 $('#'+ident).css('background','#C8FFC8');
				//}

			}

		}
	}
StopChrono();
$('#options_grille').css('display','none');
$('#valider').css('display','none');
return false;
}

function EffaceSudoku()
{
for(i=0;i<16;i++)
	{
		for(j=0;j<16;j++)
		{
			ident='id_'+i+'_'+j;
			if(document.getElementById(ident) && (document.getElementById(ident).readOnly!=true) ) 
			{
				$('#'+ident).css('background','white');
				//$('#'+ident).val()='';
				document.getElementById(ident).value='';
			}	
		}
	}
}
// liste des inputs
function TestAllsInputs()
{
fin='';
	for(i=0;i<16;i++)
	{
		for(j=0;j<16;j++)
		{
			
			
			ident='id_'+i+'_'+j;
				// boucle sur les inputs
				// nom du type : case_[coord]


				if(document.getElementById(ident) && (document.getElementById(ident).readOnly!=true) ) 
				{
					// la case existe
					if(!document.getElementById('verif').checked)
						{$('#'+ident).css('background','white');fin=true;}
					else if($('#'+ident).val()!='')
						{auto_verif($('#'+ident).val(),i+'_'+j);fin=false;}
				}	
			
		}
	}
return fin;
}

function auto_verif(valeur,position)
{
erreur_=false;

	// si autoverif 
	if(document.getElementById('verif').checked)
		{	
		// on compare le sudoku plein et vide
		if($('#idSol_'+position).val()!=valeur.toUpperCase() && $('#id_'+position).val()!="")		
		{
			$('#id_'+position).css('background','#FFC0BC');
			erreur_=true;
		
		}
		else if(!document.getElementById('id_'+position).readOnly)
		{
			$('#id_'+position).css('background','white');
		}
	}

return erreur_;
}


