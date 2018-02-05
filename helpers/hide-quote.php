<?php

	require_once('../config.php');
	
	$quote_id = ($_POST['quote-id']);
	//error_log($quote_id);
	
	try {
		$con = new PDO("mysql:host=$hostname;dbname=$db", $username, $password);

		// ERROR reporting - uncomment for dev
		//$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		// prepare the data
		$sql = ('UPDATE `tbl_quotes` SET `published` = 0 WHERE `id` = :quote_id');
		$stmt = $con->prepare($sql);
		$stmt->execute(array(
            ':quote_id'=>$quote_id 
        ));

		// close the database connection
		$con = null;
	} catch(PDOException $e) {
	//error_log(3);
		echo $e->getMessage();
	}
?>





