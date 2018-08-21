<?php

$db = new db();
$count = $db->selectQuery("SELECT
COUNT(*) as counter
FROM
persons
");
$count = $count[0]['counter'];

$medals = $db->selectQuery("SELECT
COUNT(*) as counter,persons.medal
FROM
persons
GROUP BY
persons.medal
");

foreach ($medals as $key => $medal) {
    switch ($medals[$key]['medal']) {
        case 1:
            $medals[$key]['medal'] = "gold";
            break;

        case 2:
            $medals[$key]['medal'] = "silver";
            break;

        case 3:
            $medals[$key]['medal'] = "bronze";
            break;

        default:
            $medals[$key]['medal'] = "other";
            break;
    }
}

require ("views".DS."charts.php");