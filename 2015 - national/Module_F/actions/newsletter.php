<?php
$db = new db();
$info = $db->selectQuery("SELECT * FROM persons");

require ("views".DS."newsletter.php");