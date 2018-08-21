<?php
if ($game->state == 1)
    require (VIEW_DIR.'playing.php');
else
    header('Location: ?');