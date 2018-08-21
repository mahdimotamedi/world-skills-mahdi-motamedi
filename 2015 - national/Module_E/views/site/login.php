<?php

/* @var $this yii\web\View */
/* @var $model app\models\UserModel */

use yii\helpers\Html;
use yii\widgets\ActiveForm;

$this->title = 'ورود';
$this->registerCssFile("css/login.css");
?>
<div id="login-wrap">
    <h1>مدیریت زمان بندی گروه های کاری کارشناسان</h1>
    <br />
    <?php $form = ActiveForm::begin(); ?>
        <ol>
            <li>
                <?= $form->field($model, 'email') ?>
            </li>
            <li>
                <?= $form->field($model, 'password')->passwordInput() ?>
            </li>

        </ol>
    <div id="emp-msg-box">
        <div class="msg">
            <?php if (Yii::$app->session->hasFlash('no_success')) { ?>ایمیل یا رمز عبور شما اشتباه وارد شده است.<?php } ?>
        </div>
    </div>
        <div class="submit">
            <?= Html::submitButton("ورود", ['class' => 'btn btn-success']) ?>
        </div>
    <?php ActiveForm::end(); ?>
</div>