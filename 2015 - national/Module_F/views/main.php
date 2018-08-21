<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
<form>
    <input type="submit" name="r" value="fetch" />
    <input type="submit" name="r" value="newsletter" />
    <input type="submit" name="r" value="makeChart" />
</form>
<?php if (@$action) print ("action complete"); ?>
</body>
</html>