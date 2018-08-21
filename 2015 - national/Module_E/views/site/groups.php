<?php

/* @var $this yii\web\View */
/* @var $groups \app\models\GroupsModel[] */

use yii\helpers\Url;
use yii\helpers\Html;
use yii\widgets\ActiveForm;

$this->title = 'groups';
?>

<div id="content" class="employers index user-type-id-2">
    <h2 class="heading-with-button">
        <span>گروه های کاری</span>
        <a id="" href="<?= Url::to(['site/add-groups']) ?>" class="btn btn-success ">
            <span class="glyphicon glyphicon-plus"></span>
            افزودن</a>
        <div class="clear"></div>
    </h2>
    <ul id="subnav" class="clearfix">
        <li class="selected" id="nav-employees-list"><a href="<?= Url::to(['site/groups']) ?>">مدیریت گروه های کاری</a>			</li>
    </ul>
    <div id="emp-msg-box">
        <div class="msg">
            <?php if (Yii::$app->session->hasFlash('deleted')) { ?>گروه کاری مورد نظر با موفقیت حذف گردید.<?php } ?>
        </div>
    </div>
    <div id="employees-list">

        <ol id="employees">
            <?php foreach ($groups as $group) { ?>
                <li>
                    <div class="employeebox">
                        <a href="<?= Url::to(['site/delete-group', 'id' => $group['id']]) ?>" class="deletebtn glyphicon glyphicon-remove" title="Delete"></a>
                        <a href="<?= Url::to(['site/edit-group', 'id' => $group['id']]) ?>" class="editbtn glyphicon glyphicon-edit" title="Edit"></a>
                        <h3 onclick="window.location = '<?= Url::to(['site/edit-group', 'id' => $group['id']]) ?>'"><?= $group['title'] ?></h3>
                        <div class="manager notice"><?= ($group->getTasks()->count() == 0) ? 'بدون' : $group->getTasks()->count(); ?> کارشناس عضو</div>
                        <?php if ($group->getTimeShifts()->count() == 0) { ?>
                            <span class="error" style="padding:3px;float:left;margin:7px;">بازه زمانی برای گروه کاری تعیین نشده</span>
                        <?php } else { ?>
                        <a class="btn btn-success " style="float:left;margin-left:20px;" href="<?= Url::to(['site/add-expert-to-group', 'group_id' => $group['id']]) ?>" id=""><span class="glyphicon glyphicon-plus"></span>تعیین اعضا</a>
                        <?php } ?>
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
