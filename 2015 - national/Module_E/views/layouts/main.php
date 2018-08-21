<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use yii\widgets\Menu;
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
    <link rel="shortcut icon" href="<?= Url::to('@web/img/favicon.ico') ?>" type="image/x-icon" />
    <?php $this->head() ?>
</head>
<body>
<?php $this->beginBody() ?>

<div id="header-wrap">
    <div id="header">
        <h1>
            <img src="<?= Yii::$app->user->identity['picture'] ? Url::to('@web/upload/'.Yii::$app->user->identity['picture']) : Url::to('@web/img/nophoto.png'); ?>"  class="profile-avatar company-logo" />
            <div class="company-meta ">
                <a href="<?= Url::to(['site/experts']) ?>"><?= Yii::$app->user->identity['fname'] ?></a>
                <div class="welcome-user"><?= Yii::$app->user->identity['email'] ?></div>
            </div>
            <div class="clear">
            </div>
        </h1>
        <div id="extra-options" class="btn-group btn-top-nav-controls">
            <button type="button" class="btn dropdown-toggle" data-toggle="dropdown">مدیریت حساب
				<span class="caret">
				</span>
            </button>
            <ul class="dropdown-menu pull-left" role="menu">
                <li>
                    <a href="<?= Url::to(['/site/logout']) ?>">
                        <span class="glyphicon glyphicon-share"></span> خروج
                    </a>
                </li>
            </ul>
        </div>
        <ul id="main-nav" class="clearfix">
            <li id="first-nav-item">
                <a href="<?= Url::to('@web') ?>">
                    <span class="inner">صفحه نخست</span>
                </a>
            </li>
            <li>
                <a href="<?= Url::to(['/site/experts']) ?>">
                    <span class="inner">کارشناسان</span>
                </a>
            </li>
            <li >
                <a href="<?= Url::to(['/site/groups']) ?>">
                    <span class="inner">گروه‌های کاری</span>
                </a>
            </li>
            <li >
                <a href="<?= Url::to(['/site/schedules']) ?>">
                    <span class="inner">زمانبندی</span>
                </a>
            </li>
            <li >
                <a href="<?= Url::to(['/site/download-backup']) ?>" class="backup">
                    <span class="inner">دریافت پشتیبان</span>
                </a>
            </li>
        </ul>
        <div class="clear">
        </div>
    </div>
</div>
<!-- /#header -->
<!-- content -->
<div id="wrap">
    <?= $content ?>

    <div id="footer">
        &copy; پانزدهمین مسابقات ملی مهارت
    </div>
</div>

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
