<?php
if ($game->state == 0)
    die(json_encode(['res' => 'no']));

$s = $_GET['pick'];
$game->set_player_pick($s);

if (!$game->winner)
    $i = $game->create_computer_pick();
else
    $i = null;

die(json_encode(['c_pick' => $i, 'winner' => $game->winner,
    'p_score' => $game->p_score, 'c_score' => $game->c_score, 'time' => $game->get_time()]));