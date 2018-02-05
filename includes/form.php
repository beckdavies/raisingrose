<form action="helpers/sendpdo.php" method="post" id="quoteForm">
	<textarea type="text" name="quote" id="quote" class="js-quote" placeholder="what did she say?" required></textarea>
	<textarea type="text" name="about" id="about" placeholder="about?"></textarea>
	<input type="hidden" id="lat" name="lat" />
	<input type="hidden" id="long" name="long" />
	<input type="hidden" id="published" name="published" value="1" />
	<input type="submit" name="submit" value="save" class="save is-hidden" />
</form>