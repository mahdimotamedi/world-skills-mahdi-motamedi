<?php

/* @var $this yii\web\View */
/* @var $model */

use yii\helpers\Url;
use yii\helpers\Html;
use yii\widgets\ActiveForm;

$this->title = 'add role';
?>

<div id="content" class="employers index user-type-id-2">
    <h2 class="heading-with-button">
        <span>کارشناسان</span>
        <a id="" href="<?= Url::to(['/site/add-expert']) ?>" class="btn btn-success ">
            <span class="glyphicon glyphicon-plus"></span>
            افزودن</a>
        <div class="clear"></div>
    </h2>
    <ul id="subnav" class="clearfix">
        <li id="nav-employees-list"><a href="<?= Url::to(['/site/experts']) ?>">مدیریت کارشناسان</a>			</li>
        <li id="nav-employees-roles"  class="selected">
            <a href="<?= Url::to(['/site/roles']) ?>">مدیریت نقش ها</a>
        </li>
    </ul>


    <h3 class="heading-with-button">
        <span>فهرست نقش ها</span>
        <a id="add-role" href="<?= Url::to(['/site/add-role']) ?>" class="btn btn-success ">
            <span class="glyphicon glyphicon-plus"></span>
            افزودن</a>
        <div class="clear"></div></h3>
    <br />
    <br />

    <!-- add emp -->
    <div id="employees-form">
        <div id="emp-msg-box">
            <div class="msg"><?php if (Yii::$app->session->hasFlash('saved')) { ?>نقش با موفقیت ذخیره شد.<?php } ?></div>
        </div>
        <?php $form = ActiveForm::begin(); ?>
            <a name="top-form-"></a>
            <div class="emp-tabs" style="">
                <ol style="padding:20px;">
                    <li class="clearfix">
                        <?= $form->field($model, 'title') ?>
                    </li>
                    <li class="clearfix">
                        <?= $form->field($model, 'admin_access')->checkbox(['value' => 1], false) ?>
                    </li>
                </ol>
                <div class="clear">&nbsp;</div>
            </div>
            <div id="employee-field-buttons" class="emp-field-btns" style="padding:0 20px 10px;">
                <?= Html::submitButton("ثبت",['class' => 'submitbtn-add btn btn-success']) ?>
                <div class="clear"></div>
            </div>
        <?php ActiveForm::end(); ?>
    </div>

</div>