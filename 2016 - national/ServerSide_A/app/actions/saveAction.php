<?php
$today = date('Y-m-d');
$db->query("INSERT INTO `scores`(`nick_name`, `picture`, `p_score`, `c_score`, `set_date`, `time_seconds`) VALUES ('{$_POST['nickname']}','{$game->picture}','{$game->p_score}','{$game->c_score}','{$today}','{$game->time_seconds}')");

header("Location: ?");