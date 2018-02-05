<?php

require_once('../config.php');
//error_log(1);

	if(isset($_POST['quote'])) {
		$quote = ($_POST['quote']);
	}
	$about = ($_POST['about']);
	$lat = ($_POST['lat']);
	$long = ($_POST['long']);
	$published = ($_POST['published']);

	try {
		$con = new PDO("mysql:host=$hostname;dbname=$db", $username, $password);
		
		// ERROR reporting - uncomment for dev
		// $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		// prepare the data
		$sql = 'INSERT INTO tbl_quotes (`quote`, `about`,`latitude`, `longitude`, `published`) VALUES (:quote, :about, :lat, :long, :published)';
		$stmt = $con->prepare($sql);
		$stmt->execute(array(
			':quote'=>$quote,
            ':about'=>$about,
            ':lat'=>$lat,
            ':long'=>$long,
            ':published'=>$published 
        ));

		//header('Location: index.php?status=1');

		// close the database connection
		$con = null;
	} catch(PDOException $e) {
	//error_log(3);
		echo $e->getMessage();
	}

?>