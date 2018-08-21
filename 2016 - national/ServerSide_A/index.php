<?php
error_reporting(E_ALL ^ E_NOTICE);

define('ROOT', __DIR__);
define('DS', DIRECTORY_SEPARATOR);

define('CONTROLLER_DIR', ROOT.DS.'app'.DS.'actions'.DS);
define('VIEW_DIR', ROOT.DS.'app'.DS.'views'.DS);
define('MODEL_DIR', ROOT.DS.'app'.DS.'models'.DS);
define('CLASS_DIR', ROOT.DS.'app'.DS.'classes'.DS);

function load_class($class) {
    require_once (CLASS_DIR.$class.'Object.php');
}

$address = (@$_GET['r'] ? $_GET['r'] : 'main').'Action';

if (file_exists(CONTROLLER_DIR.$address.'.php')) {
    require_once (CONTROLLER_DIR.'base.php');
    require_once (CONTROLLER_DIR.$address.'.php');
}
else
    die ("error 404: page not found");