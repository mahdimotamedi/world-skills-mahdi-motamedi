<?php

/* @var $this yii\web\View */
/* @var $model app\models\UserModel */
/* @var $roles */

use yii\helpers\Url;
use yii\helpers\Html;
use yii\widgets\ActiveForm;
use yii\helpers\ArrayHelper;

$this->title = 'add experts';
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
        <li class="selected" id="nav-employees-list"><a href="<?= Url::to(['/site/experts']) ?>">مدیریت کارشناسان</a>			</li>
        <li id="nav-employees-roles" >
            <a href="<?= Url::to(['/site/roles']) ?>">مدیریت نقش ها</a>
        </li>
    </ul>
    <!-- add emp -->
    <div id="employees-form">
        <div id="emp-msg-box">
            <div class="msg">
                <?php if (Yii::$app->session->hasFlash('saved')) { ?>اطلاعات کارشناس با موفقیت ذخیره شد.<?php } ?>
                <?php if (Yii::$app->session->hasFlash('duplicate_email')) { ?>قبلا کاربری با این ایمیل ثبت شده است. لطفا یک ایمیل دیگر انتخاب نمایید.<?php } ?>
            </div>
        </div>
        <?php $form = ActiveForm::begin(['options' => ['enctype' => 'multipart/form-data',]]); ?>
            <a name="top-form-"></a>
            <div class="emp-tabs" style="">
                <ol id="employee-field-inputs-" style="padding:20px;"  class="employee-add-edit- emp-field-inputs">
                    <li class="clearfix">
                        <?= $form->field($model, 'fname') ?>
                    </li>
                    <li class="clearfix">
                        <?= $form->field($model, 'lname') ?>
                    </li>
                    <li class="clearfix">
                        <?= $form->field($model, 'email') ?>
                    </li>
                    <li class="clearfix">
                        <?= $form->field($model, 'password')->passwordInput() ?>
                    </li>
                    <li class="clearfix">
                        <?= $form->field($model, 'role_id')
                            ->dropDownList(ArrayHelper::map($roles, 'id', 'title')) ?>
                    </li>
                    <li class="clearfix">
                        <?= $form->field($model, 'avatar_pic')->fileInput(); ?>
                    </li>
                </ol>
                <div class="clear">&nbsp;</div>
            </div>
            <div id="employee-field-buttons" class="emp-field-btns" style="padding:0 20px 10px;">
                <?= Html::submitButton("ثبت اطلاعات",['class' => 'submitbtn-add btn btn-success']) ?>
                <div class="clear"></div>
            </div>
    </div>
    <?php ActiveForm::end(); ?>
</div>