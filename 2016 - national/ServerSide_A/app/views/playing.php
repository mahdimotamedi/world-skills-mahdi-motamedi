<?php include (VIEW_DIR.'libs'.DS.'head.php'); ?>

<article class="col col-game-spacing">
	<article class="subtitle-row">
		<h2>Playing game...</h2>
		<article class="alert-spacing">
			<article class="alert game-alert onEndShow" style="display: none;">You <span id="WinOrLose">Win!!</span></article>
		</article>
		<figure class="container-photo circle img_tic o"></figure>
		<figure class="container-photo circle img_tic x"></figure>
		<p class="dates onEndHide">Time: <span class="time"><?= $game->get_time(); ?> sec</span></p>
		<h3 class="relative-pos-game">
			<span class="points"><span class="nameuser">Player: <span class="usermoves moves"><?= $game->p_score; ?></span></span></span><span class="points"><span class="computer">Computer: <span class="computermoves moves"><?= $game->c_score; ?></span></span></span>
		</h3>
	</article>
	<article class="container-row relative-pos-game">
		<article class="game">
			<?php for ($i=1 ; $i<=9 ; $i++) {
				switch ($game->game_table[$i]) {
					case null:
						print ("<article class=\"field\"><button id=\"$i\" class=\"btn img_tic\"></button></article>");
						break;

					case 'p':
						print ("<article class=\"field\"><button id=\"$i\" class=\"btn img_tic o\" disabled></button></article>");
						break;

					case 'c':
						print ("<article class=\"field\"><button id=\"$i\" class=\"btn img_tic x\" disabled></button></article>");
						break;
				}
			} ?>
		</article>
	</article>
	<article class="container-row center form onEndShow" style="display: none;">
		<article class="form-win">
			<form method="post" action="?r=save" onsubmit="
				if ($('#nickname').val() == '') {
					$('.alert').show();
					return false;
				}
				">
				<label for="nickname">Enter your Nickname </label>
				<input id="nickname" type="text" name="nickname" placeholder="Nickname">
				<input type="submit" name="" id="" class="" value="Submit">
			</form>
			<article class="alert-spacing-error">
				<article class="alert" style="display: none;"><span class="underline">Message:</span> Enter your nickname !!</article>
			</article>
		</article>
		<br>
	</article>
	<div class="button-start">
		<a href="?r=restart"><button>START NEW GAME</button></a>
	</div>
</article>

	<style>
		<?php if ($game->picture) { ?>
		.o {
			background: url("uploads/<?= $game->picture ?>") no-repeat center center !important;
			background-size: 60px !important;
			border-radius: 50%;
			border: 1px solid rgba(0, 0, 0, .2) !important;
		}
		<?php } ?>
	</style>

<?php include (VIEW_DIR.'libs'.DS.'foot.php'); ?>