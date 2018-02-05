<?php

	require_once('../config.php');

	if( ! ini_get('date.timezone') )
	{
	date_default_timezone_set('Europe/London');
	}
	
	try {
		$con = new PDO("mysql:host=$hostname;dbname=$db", $username, $password);

		// ERROR reporting - uncomment for dev
		//$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		// prepare the data
		$sql = ("SELECT id, quote, about, time FROM tbl_quotes WHERE published = 1 ORDER BY time DESC");
		$query = $con->prepare($sql);
		$query->execute();
		$results = $query->fetchAll( PDO::FETCH_ASSOC );

		foreach( $results as $row ){

			$newDate = date("D j M Y, g:ia", strtotime($row['time']));
			$newQuote = stripslashes(str_replace(PHP_EOL, '<br />', $row['quote']));
			
			echo "<div class=\"quote-container js-quote-container\">";
				echo "<div class=\"quote is-editable js-editable\">".$newQuote."</div>";
				if ($row['about']) {
					echo "<div class=\"about is-editable js-editable\">".stripslashes($row['about'])."</div>";
				}
				echo "<div class=\"date is-editable js-editable\">".$newDate."</div>";
				echo "<input type=\"submit\" value=\"hide\" class=\"quote-action-hide js-quote-action-hide is-hidden\"/>";
				echo "<input type=\"hidden\" id=\"quote-id\" name=\"quote-id\" value=\"".stripslashes($row['id'])."\" />";
			echo "</div>";
		}

		// close the database connection
		$con = null;
	} catch(PDOException $e) {
	//error_log(3);
		echo $e->getMessage();
	}
?>