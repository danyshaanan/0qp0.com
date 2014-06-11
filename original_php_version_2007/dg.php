<?php


$myFile = "dg.txt";
$fh = fopen($myFile, 'r');
$theData = fread($fh, 2007);
fclose($fh);


if (isset($_GET['n'])) {
	$nn = $_GET['n'];
	if (($nn <= 640) && (0 < $nn))
		{
		$theData = substr_replace($theData,1 - substr($theData,$nn+2,1),$nn+2,1);

		$fh = fopen($myFile, 'w') or die("can't open file");
		fwrite($fh, $theData);
		fclose($fh);
	}
}


echo $theData;

	
?>
