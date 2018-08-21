<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use yii\helpers\Url;
use app\assets\AppAsset;

AppAsset::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>
<body>
<?php $this->beginBody() ?>
<a class="sr-only sr-only-focusable" href="#content" tabindex="1">
    <div class="container"><span class="skiplink-text">Skip to main content</span></div>
</a>
<div class="navbar navbar-worldskills navbar-static-top">
    <div class="cube-container">
        <div class="cube-right-bottom-blue">&nbsp;</div>
    </div>
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse"><span
                    class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span
                    class="icon-bar"></span> <span class="icon-bar"></span></button>
            <a class="navbar-brand" href="<?= Url::to('@web') ?>">Reservations</a></div>
        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav">
                <li><a href="<?= Url::to('@web') ?>">Information</a></li>
                <li><a href="<?= Url::to(['site/start-booking']) ?>">Booking</a></li>
                <li><a href="<?= Url::to(['management/index']) ?>">Management</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <!-- use the following link for login and logoff -->
                <li><a href="#">Login</a></li>
            </ul>
        </div>
    </div>
</div>

<div class="container">

    <?= $content ?>

    <footer>
        <hr class="hr-extended"/>
        <p>© 2015 WorldSkills</p>
    </footer>
</div>

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
