<?php 

	require_once('config.php');

	//print_r($_SERVER);
	$quote = strlen($_POST['quote']) > 0 ? mysql_escape_string($_POST['quote']) : die("ERROR: Enter a quote");
	$location = mysql_escape_string($_POST['location']);
	$lat = mysql_escape_string($_POST['lat']);
	$long = mysql_escape_string($_POST['long']);
	
	$connection = mysql_connect($hostname, $username, $password) or die ("Unable to connect");
	mysql_select_db($db) or die ("Unable to select database");
	$query = "INSERT INTO tbl_quotes (`quote`, `location`, `latitude`, `longitude`) VALUES ('$quote', '$location', '$lat', '$long')";
	$result=mysql_query($query) or die ("Error in query: $query".mysql_error());

	header('Location: index.php?status=1');
	
	mysql_close($connection);	
?>