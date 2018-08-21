<?php include (VIEW_DIR.'libs'.DS.'head.php'); ?>

<article class="col border-line col-game-spacing">
	<article class="subtitle-row">
		<h2>Start new game</h2>
	</article>
	<article class="container-row form">
		<form  class="form-content" action="?r=restart" method="post" enctype="multipart/form-data">
			<label for="photo">Upload photo <span class="optional right"> Optional </span></label>
			<input id="photo" type="file" name="photo"><br>
			<input type="hidden" name="template" id="" class="" value="1">
			<input type="submit" name="" id="" value="START NEW GAME">
		</form>
		<?php if (isset($_SESSION['error'])) { unset($_SESSION['error']); ?>
		<article class="alert-spacing-error">
			<article class="alert"><span class="underline">Error uploading photo:</span> Verify size or type of file!!</article>
		</article>
		<?php } ?>
	</article>
</article>

<?php include (VIEW_DIR.'libs'.DS.'foot.php'); ?>