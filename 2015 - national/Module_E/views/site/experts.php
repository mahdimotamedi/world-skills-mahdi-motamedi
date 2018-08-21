<?php

/* @var $this yii\web\View */
/* @var $experts \app\models\UserModel[] */
/* @var $search_model */

use yii\helpers\Url;
use yii\widgets\ActiveForm;
use yii\helpers\Html;

$this->title = 'Experts';
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
    <div id="emp-msg-box">
        <div class="msg">
            <?php if (Yii::$app->session->hasFlash('deleted')) { ?>کارشناس مورد نظر با موفقیت حذف گردید.<?php } ?>
        </div>
    </div>
    <div id="employees-list">
        <?php $form = ActiveForm::begin(['method' => 'get']); ?>
            <div class="filter-box">
                <h4>صافی (فیلتر)</h4>
            </div>
            <div class="filter-box" style="display:block">
                <?= $form->field($search_model, 'fname')->textInput(['class' => 'filter-by-employee', 'placeholder' => 'نام کارشناس'])->label(false) ?>
            </div>
            <div class="filter-box">
                <?= Html::submitButton("ثبت", ['class' => 'btn filter submit btn-default']) ?>
            </div>
        <?php $form->end(); ?>
        <div class="clear"></div>
        <ol id="employees">
            <?php foreach ($experts as $expert) { ?>
                <li>
                    <div class="employeebox">
                        <img src="<?= (!$expert['picture']) ? Url::to("@web/img/nophoto.png") : Url::to("@web/upload/{$expert['picture']}") ?>"  class="profile-avatar " />
                        <a href="<?= Url::to(["site/delete-expert", 'id' => $expert['id']]) ?>" class="deletebtn glyphicon glyphicon-remove" title="Delete"></a>
                        <h3 onclick="window.location = '<?= Url::to(["site/edit-expert", 'id' => $expert['id']]) ?>'"><?= $expert['fname']." ".$expert['lname'] ?> <span><?= $expert['email'] ?></span></h3>
                        <div class="manager notice"><?= $expert['title'] ?></div>
                        <div class="clear"></div>
                    </div>
                </li>
            <?php } ?>
        </ol>
        <div class="clear"></div>
        <div class="pagination-block clear">
            <div class="clear"></div>
            <div class="pagination-counter">نمایش صفحه 1 از 1</div>
        </div>
    </div>
</div>