<?php

/* @var $this yii\web\View */
/* @var $model */

use yii\helpers\Url;
use yii\helpers\Html;
use yii\widgets\ActiveForm;

$this->title = 'add group';
?>

<div id="content" class="employers index user-type-id-2">
    <h2 class="heading-with-button">
        <span>گروه های کاری</span>
        <a id="" href="<?= Url::to(['site/groups']) ?>" class="btn btn-success ">
            <span class="glyphicon glyphicon-plus"></span>
            افزودن</a>
        <div class="clear"></div>
    </h2>
    <ul id="subnav" class="clearfix">
        <li class="selected" id="nav-employees-list"><a href="<?= Url::to(['site/groups']) ?>">مدیریت گروه های کاری</a>			</li>
    </ul>
    <!-- add emp -->
    <div id="employees-form">
        <div id="emp-msg-box">
            <div class="msg"><?php if (Yii::$app->session->hasFlash('saved')) { ?>گروه کاری با موفقیت ذخیره شد.<?php } ?></div>
        </div>
        <?php $form = ActiveForm::begin(); ?>
            <a name="top-form-"></a>
            <div class="emp-tabs" style="">
                <ol style="padding:20px;">
                    <li class="clearfix">
                        <?= $form->field($model, 'title') ?>
                    </li>
                </ol>
                <div class="clear">&nbsp;</div>
            </div>
            <div id="employee-field-buttons" class="emp-field-btns" style="padding:0 20px 10px;">
                <?= Html::submitButton("ثبت", ['class' => 'submitbtn-add btn btn-success']); ?>
                <div class="clear"></div>
            </div>
    </div>
    <?php ActiveForm::end(); ?>
</div>