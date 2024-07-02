<div id='SudokuGrille'>

  <form style='border:0;' class='FormGrille' onsubmit="return false;"> 
<div style="margin-bottom:20px;text-align:left;">

    <table border="0" cellpadding="0" cellspacing="0" align="center">
	<tr>
	<td align="left" valign="top">
 <div style="text-align:left;" id="selectiongrille" style='display:none;'>
<select style="font-family:arial;font-size:11px;border:0px;padding:2px;" name="dimension" id="dimension">
	<option value="4*2">4X4</option>
	<option value="6*3">6X6</option>
	<option value="8*4">8X8</option>
	<option value="9*3">9X9</option>
	<option value="10*5">10X10</option>
	<option value="12*3">12X12</option>
	<option value="14*7">14X14</option>
	<option value="16*4">16X16</option>
</select>

<select style="font-family:arial;font-size:11px;border:0px;padding:2px;" name="type" id="type">
	<option value="numeros">Numeros</option>
	<option value="lettres">Lettres</option>
	<option value="mixte">Mixte</option>
</select>

</div><br />
</td>
	<td width="20">&nbsp;</td>

	 <td valign="top" width="200" align="left" valign="top">
 <div style="text-align:left;font-family:arial;font-size:11px;">
Niveau : 
<select style="font-family:arial;font-size:11px;border:0px;padding:2px;" name="niveau" id="niveau">
	<option value="0">1</option>
	<option value="1">2</option>
	<option value="2">3</option>
</select>
<input type="submit" name="choice_grille" value='ok' onclick="GetSudokuNew();return false;"  style="font-family:arial;font-size:11px;border:0px;padding:2px;" />
</div><br />
	</td>
	</tr>
	<tr>
	<td valign="top" style="white-space: nowrap;">
	<div id="bloc_grille">
	<div style="text-align:right;margin-bottom:5px;font-family:arial;margin-right:10px;font-size:11px;" id='chronotime'></div>

	    <!--Cases-->
	      [DIV]
		<input type='text' name='case_[coord]' id='id_[coord]' value='[value]' class='GrilleCSS [class]' [Disabled] onkeyup="auto_verif(this.value,'[coord]');"  autocomplete="off" />
	      [/DIV]  
	    <!--/Cases-->
	    <div style="text-align:right;margin-bottom:5px;margin-right:10px;"><!--<a title="Vous pouvez vous aussi installer PhpSudo gratuitement sur votre site internet" href="http://phpsudo.free.fr" style="font-size:11px;text-decoration:none;color:#000;font-family:arial;" target="_blank">phpsudo.free.fr</a>--></div>
	</div>
	</td>
	<td width="20">&nbsp;</td>
	<td valign="top" width="200" align="left">
	<div class="options" id="bloc_options" style="margin-top:18px;">
		<div id="options_grille">
		<table border="0" cellpadding="0" cellspacing="0">
			
			<tr><td width="30"><input type="checkbox" name="verif" id="verif" onclick='TestAllsInputs();'></td><td style="font-family:arial;font-size:12px;">Auto-vérif</td></tr>
<tr><td width="30" height="25">&nbsp;</td><td style="font-family:arial;font-size:12px;"><!--<a href="#" onclick="PrintSudoku();return false;" style="color:#000;text-decoration:none;font-family:arial;font-size:12px;font-weight:normal;">:: Imprimer</a>--></td></tr>
			<tr><td height="25">&nbsp;</td><td><a href="#SudokuGrille" onclick="affiche_solution();return false;" style="color:#000;text-decoration:none;font-family:arial;font-size:12px;font-weight:normal;">:: Solution</a></td></tr>
			<tr><td height="25" width="30">&nbsp;</td><td><a href="#SudokuGrille" onclick="EffaceSudoku();return false;" style="color:#000;text-decoration:none;font-family:arial;font-size:12px;font-weight:normal;">:: Effacer</a></td></tr>

		</table></div>
		<div>
		<table border="0" cellpadding="0" cellspacing="0">
		<tr><td width="30">&nbsp;</td><td height="25"><a href="#SudokuGrille" onclick="GetSudokuNew();" style="color:#000;text-decoration:none;font-family:arial;font-size:12px;font-weight:normal;">:: Autre grille</a></td></tr>
		<tr><td width="30" height="40" valign="bottom">&nbsp;</td><td valign="bottom">&nbsp;<input id="valider" type="submit" onclick="verif_grille();return false;" value="Valider" style="border:1px solid #333;background:#fff;color:#000;font-size:12px;"></td></tr>
		

		</table>
		</div>	
	</div>	
	</td>
	</tr>
		<tr>
	<td colspan="3"><div><a href="http://nlion.online.fr/" target="_blank" style="color:#333;font-family:verdana;font-size:10px;text-decoration:none;">Code source nlion.online.fr<!-- Merci de laisser un lien vers mon site --></a></div></td>
	</tr>
    </table>
</div>
<input type="hidden" id="grillephpsudo" value="[GrilleSudoku]"/>
<input type="hidden" id="solutiongrillephpsudo" value="[SolutionSudoku]" />
<input type="hidden" id="dimgrillephpsudo" value="[DimSudoku]" />
<input type="hidden" id="niveaugrillephpsudo" value="[NiveauSudoku]" /> 
 </form>
</div> <br />
