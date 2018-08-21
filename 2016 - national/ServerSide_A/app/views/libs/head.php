<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>TIC-TAC-TOE</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<section class="container-game">
    <article class="title-row">
        <h1>TIC-TAC-TOE</h1>
    </article>
    <article class="row initial-page">
        <article class="col">
            <article class="subtitle-row">
                <h2>Instructions</h2>
            </article>
            <article class="container-row">
                Instructions of game:
                <ul>
                    <li>mahdi motamedi (<a href="http://mmprogrammer.ir" target="_blank">mmpg.ir</a>)</li>
                    <li>Select Photo (optional)</li>
                    <li>Press "Start New Game"</li>
                    <li>Play Game: try to mark three fields in a vertical, horizontal or diagonal row one move before the computer</li>
                </ul>
            </article>
            <article class="subtitle-row">
                <h2>High Scores</h2>
            </article>
            <article class="container-row high scroll">
                <article class="scroll-view">
                    <?php $i=0; foreach ($HighScores as $score) { $i++; ?>
                        <article class="score">
                            <h4 class="pos"
                                <?php if ($score['picture']) { ?>
                                    style="background: url('uploads/<?= $score['picture'] ?>')no-repeat center center;background-size: cover"
                                <?php } ?>>
                                <?= $i ?>
                            </h4>
                            <h4 class="name-high"><?= $score['nick_name'] ?><span class="moves"><span><?= $score['p_score'] ?></span>-<span><?= $score['c_score'] ?></span></span></h4>
                            <p>
                                <span class="date-high"><?= $score['set_date'] ?></span><span class="time-high"><?= $score['time_seconds'] ?> sec</span>
                            </p>
                        </article>
                    <?php } ?>
                </article>
            </article>
        </article>