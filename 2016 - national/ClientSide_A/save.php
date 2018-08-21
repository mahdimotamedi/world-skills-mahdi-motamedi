<?php
foreach ($_REQUEST as $index => $request) {
    $_REQUEST[$index] = htmlspecialchars($request, ENT_QUOTES);
}
//$con = mysqli_connect("localhost", "ka2yar_mahdi", "kbyDjWuPO", "ka2yar_CustomPuzzle");
$con = mysqli_connect("localhost", "root", "", "16th_clientside_a");
mysqli_query($con, "INSERT INTO `ranking` (`name`,`difficult_id`,`time`)
  VALUES ('{$_REQUEST['name']}','{$_REQUEST['difficult_id']}','{$_REQUEST['time']}')");

$info = mysqli_query($con, "SELECT * FROM `ranking` WHERE `difficult_id` = '{$_REQUEST['difficult_id']}' ORDER BY `time` ASC LIMIT 0,9");
$info = mysqli_fetch_all($info, MYSQLI_ASSOC);
$pos = 1;
foreach ($info as $item) {
    switch ($item['difficult_id']) {
        case 1:
            $item['difficult'] = "EASY";
            break;
        case 2:
            $item['difficult'] = "MEDIUM";
            break;
        case 3:
            $item['difficult'] = "HARD";
            break;
    }

    ?>
    <tr>
        <td><?= $pos++ ?></td>
        <td><?= $item['difficult'] ?></td>
        <td><?= $item['name'] ?></td>
        <td><?= $item['time'] ?></td>
    </tr>
    <?php
}