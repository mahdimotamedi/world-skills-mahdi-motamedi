<?php
session_start();

require_once (MODEL_DIR.'db.php');
$db = new db();

$HighScores = $db->select("SELECT * FROM scores ORDER BY time_seconds ASC, `set_date` DESC");

load_class('game');
$game = new game();