<?php
error_reporting(E_ALL ^ E_NOTICE);
define("ROOT", __DIR__);
define("DS", DIRECTORY_SEPARATOR);
$address = @$_GET['r'] ? $_GET['r'] : 'main';

if (file_exists("actions".DS."{$address}.php")) {
    require ("models".DS."db.php");
    require ("actions".DS."{$address}.php");
}
else
    die ("404 : not found");