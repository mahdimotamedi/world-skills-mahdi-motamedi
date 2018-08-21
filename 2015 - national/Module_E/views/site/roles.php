<?php

/* @var $this yii\web\View */
/* @var $roles */

use yii\helpers\Url;
use yii\helpers\Html;
use yii\widgets\ActiveForm;

$this->title = 'roles';
?>

<div id="content" class="employers index user-type-id-2">
    <h2 class="heading-with-button">
        <span>کارشناسان</span>
        <a id="" href="<?= Url::to(['site/add-expert']) ?>" class="btn btn-success ">
            <span class="glyphicon glyphicon-plus"></span>
            افزودن</a>
        <div class="clear"></div>
    </h2>
    <ul id="subnav" class="clearfix">
        <li id="nav-employees-list"><a href="<?= Url::to(['/site/experts']) ?>">مدیریت کارشناسان</a>			</li>
        <li id="nav-employees-roles"  class="selected">
            <a href="<?= Url::to(['site/roles']) ?>">مدیریت نقش ها</a>
        </li>
    </ul>


    <h3 class="heading-with-button">
        <span>فهرست نقش ها</span>
        <a id="add-role" href="<?= Url::to(['/site/add-role']) ?>" class="btn btn-success ">
            <span class="glyphicon glyphicon-plus"></span>
            افزودن</a>
        <div class="clear"></div></h3>
    <br />
    <div id="emp-msg-box">
        <div class="msg">
            <?php if (Yii::$app->session->hasFlash('deleted')) { ?>نقش مورد نظر با موفقیت حذف گردید.<?php } ?>
        </div>
    </div>
    <br />

    <ol id="role-list" class="quick-list nice-list">

        <?php foreach ($roles as $role) { ?>
            <li>
                <a title="Edit role" class="editbtn glyphicon glyphicon-pencil" href="<?= Url::to(['site/edit-role', 'id' => $role['id']]) ?>"></a>
                <a title="Delete role" class="deletebtn glyphicon glyphicon-remove" href="<?= Url::to(['site/delete-role', 'id' => $role['id']]) ?>"></a>
                <div class="inner-content">
                    <div class="role-style">
                        <h3><?= $role['title'] ?></h3>
                    </div>



                    <div style="clear:both"></div>
                </div>
                <div style="clear:right"></div>
            </li>
        <?php } ?>

    </ol>
</div>