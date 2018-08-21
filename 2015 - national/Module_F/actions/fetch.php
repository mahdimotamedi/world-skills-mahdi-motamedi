<?php
ob_start();
$doc = new DOMDocument();
$doc->loadHTMLFile("http://dpweb.ir");

$xpath = new DOMXPath($doc);
$div = $xpath->query('//*[@id="Content"]/div/div/div/div[2]/div/div/div')->item(0);
$childes = $div->childNodes;

$results = [];
$i = 0;

foreach ($childes as $child) {
    if ($child->getAttribute('class') == "column mcb-column one-second column_zoom_box " ||
        $child->getAttribute('class') == "column mcb-column one-third column_zoom_box ") {
        $ch = $child->childNodes->item(0);
        $ch = $ch->childNodes->item(0);
        $ch = $ch->childNodes;
        $img = $ch->item(0);
        $img = $img->childNodes->item(0);

        $text = $ch->item(1);
        $text = $text->childNodes->item(0);
        $text = $text->childNodes->item(1);
        $text = $text->nodeValue;

        $results[$i]['pic'] = file_get_contents($img->getAttribute('src'));
        $results[$i]['name'] = $text;

        $i++;
    }
}

// change the pictures
foreach ($results as $key => $result) {
    $image = imagecreatefromstring($result['pic']);
    $size = getimagesizefromstring($result['pic']);
    $watermark = imagecreatefrompng(ROOT.DS.'watermark.png');
    $watermark_size = getimagesize(ROOT.DS.'watermark.png');
    $text_color = imagecolorallocate($image, 255, 255, 255);

    imagecopy($image, $watermark, 0, $size[1]-$watermark_size[1], 0, 0, $size[0], $size[1]);
    imagettftext($image, 14, 0, 10, $size[1]-($watermark_size[1]/2)+6, $text_color, ROOT.DS."arial.ttf" ,"fsddfs sfsd");
    ob_clean();
    imagejpeg($image);
    $results[$key]['pic'] = base64_encode(ob_get_contents());
}
ob_clean();

$db = new db();

$query = "INSERT INTO persons (`full_name`, `pic`) VALUES ";
foreach ($results as $key => $result) {
    $query .= "('{$result['name']}', '{$result['pic']}'),";
}
$query = rtrim($query, ',');
$db->query($query);

$action = true;
require ("views".DS."main.php");