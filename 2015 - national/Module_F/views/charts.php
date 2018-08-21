<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>charts</title>
</head>
<body>
<table style="border: 2px solid #000;">
    <?php foreach ($medals as $medal) { ?>
        <tr>
            <td><?= $medal['medal'] ?></td>
            <td><?= round(($medal['counter']/$count) * 100, 2) ?> %</td>
        </tr>
    <?php } ?>
</table>
</body>
</html>