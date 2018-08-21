<?php
$game->restart();

$image = $_FILES['photo'];
if ($image['name']) {
    $game->upload_image($image);
}

header("Location: ?r=play");
die();