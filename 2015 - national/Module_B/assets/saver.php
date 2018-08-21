<?php
$data = $_REQUEST['fld'];
if ( is_array($data) )
	echo file_put_contents('db.csv', implode(",", $data) . "\n", FILE_APPEND) ? 1 : 2;
else 
	echo 3;
?>