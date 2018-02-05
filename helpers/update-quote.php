<?php

	require_once('../config.php');
	
	$quote_id = ($_POST['quote-id']);
	if(isset($_POST['quote'])) {
		$quote = ($_POST['quote']);
	}
	if(isset($_POST['about'])) {
		$about = ($_POST['about']);
	}
	//error_log($quote_id);
	
	try {
		$con = new PDO("mysql:host=$hostname;dbname=$db", $username, $password);

		// ERROR reporting - uncomment for dev
		//$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		// prepare the data
		if($quote) {
			$sql = ('UPDATE `tbl_quotes` SET `quote` = :quote WHERE `id` = :quote_id');
			$stmt = $con->prepare($sql);
			$stmt->execute(array(
				':quote_id'=>$quote_id,
				':quote'=>$quote
			));
		} else if ($about) {
			$sql = ('UPDATE `tbl_quotes` SET `about` = :about WHERE `id` = :quote_id');
			$stmt = $con->prepare($sql);
			$stmt->execute(array(
				':quote_id'=>$quote_id,
				':about'=>$about
			));
		} else {
			$sql = ('UPDATE `tbl_quotes` SET `date` = :date WHERE `id` = :quote_id');
			$stmt = $con->prepare($sql);
			$stmt->execute(array(
				':quote_id'=>$quote_id,
				':date'=>$date
			));
		}
		
		

		// close the database connection
		$con = null;
	} catch(PDOException $e) {
	//error_log(3);
		echo $e->getMessage();
	}
?>





