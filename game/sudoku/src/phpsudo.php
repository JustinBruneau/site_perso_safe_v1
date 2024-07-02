<?php
header("Content-Type: text/plain");
header("Cache-Control: no-cache, must-revalidate"); 
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//require_once '_inc.config.php';
require_once '_inc.class.template.php';
require_once '_inc.class.sudoku.php';

//$tpl = new template();

if(isset($_GET['niveau']))
$niveau=(int)$_GET['niveau'];
else
$niveau=2;

if(isset($_GET['dimension']))
{
$type_=explode('*',$_GET['dimension']);
$w=$type_[0];
$h=$type_[1];
unset($type_);
$dimension=$_GET['dimension'];
}
else $dimension='9*3';

if(!isset($w) || !isset($h))
{
$w=9;
$h=3;	
}
if (!is_int($w % $h)) {
    die('Erreur sur le type de grille !');
}

if(isset($_GET['newgrille']))
{

$sudo=new SuDoKu(true,$w,$h,$niveau);
}else
$sudo=new SuDoKu(true,$w,$h,$niveau);


if(!$sudo->TimeOut)
{
//récup du template
$template = fopen('grille.tpl', "r");
$TemplateGrille=fread($template, filesize('grille.tpl'));
fclose($template); unset($template);


// on remplace par des symboles
if(isset($_GET['type']) && $_GET['type']=='lettres')
{
$sudo->WithSymbol='symbole';
}

if(isset($_GET['type']) && $_GET['type']=='mixte')
$sudo->WithSymbol='Mixte';

$Grille=$sudo->drawing($sudo->IncompleteGrille,$TemplateGrille);

$Grille->assign('SolutionSudoku',base64_encode($sudo->lineariser_grilles($sudo->GrillePleine)),$TemplateGrille);
$Grille->assign('GrilleSudoku',base64_encode($sudo->lineariser_grilles($sudo->IncompleteGrille)),$TemplateGrille);
$Grille->assign('DimSudoku',$dimension,$TemplateGrille);
$Grille->assign('NiveauSudoku',$niveau,$TemplateGrille);
// on traite la solution dans un tableau javascript
echo $Grille->PrintPage($TemplateGrille);


$template = fopen('solution.tpl', "r");
$TemplateSolution=fread($template, filesize('solution.tpl'));
fclose($template); unset($template);

$Grille2=$sudo->drawing($sudo->GrillePleine,$TemplateSolution);

echo $Grille2->PrintPage($TemplateSolution);

}
else
{

	echo 'TIMEOUT';

}
?>
