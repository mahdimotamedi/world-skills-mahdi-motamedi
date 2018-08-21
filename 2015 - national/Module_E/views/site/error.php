<?php

/* @var $this yii\web\View */
/* @var $name string */
/* @var $message string */
/* @var $exception Exception */

use yii\helpers\Html;

$this->title = $name;
?>
<div class="site-error" style="text-align: center;">

    <h1 dir="ltr"><?= Html::encode($this->title) ?></h1>

    <div class="alert alert-danger">
        <?= nl2br(Html::encode($message)) ?>
    </div>

    <p>
        خطای بالا رخ داده است.
    </p>
    <p>
        اگر فکر میکنید این یک خطا از طرف سرور است، با مدیریت تماس بگیرید.
    </p>

</div>
