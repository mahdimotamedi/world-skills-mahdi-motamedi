<?php

/* @var $this yii\web\View */
/* @var $group app\models\GroupsModel */
/* @var $users \app\models\UserModel[] */
/* @var $tasks array */

use yii\helpers\Url;
use yii\helpers\Html;
use yii\widgets\ActiveForm;
use yii\helpers\ArrayHelper;

$this->title = 'Tasks';
?>

<div id="content" class="employers index user-type-id-2">
    <h2 class="heading-with-button">
        <span>تایین اعضا برای گروه کاری</span>
    </h2>
    <!-- add emp -->
    <div id="employees-form">
        <div id="emp-msg-box">
            <div class="msg">
                <?php if (Yii::$app->session->hasFlash('saved')) { ?>کارشناسان با موفقیت اضافه شدند.<?php }
                else if (Yii::$app->session->hasFlash('countError')) { ?>حداکثر 4 کارشناس برای یک گروه میتوان تعیین کرد.<?php } ?>
            </div>
        </div>

        <form id="w-1" method="post">
            <a name="top-form-"></a>
            <div class="emp-tabs" style="">
                <ol id="employee-field-inputs-" style="padding:20px;"  class="employee-add-edit- emp-field-inputs">
                    <li class="clearfix">
                        <label for="experts_select">اعضای انتخابی</label>
                        <select name="experts[]" id="experts_select" multiple>
                            <?php foreach ($users as $user) {
                                if (@$tasks[$user->id])
                                    continue;
                                ?>
                                <option value="<?= $user->id ?>"><?= $user->fname . ' ' . $user->lname ?></option>
                            <?php } ?>
                        </select>
                    </li>
                </ol>
                <div class="clear">&nbsp;</div>
            </div>

            <div id="employee-field-buttons" class="emp-field-btns" style="padding:0 20px 10px;">
                <?= Html::submitButton("اضافه کردن اعضا",['class' => 'submitbtn-add btn btn-success']) ?>
                <div class="clear"></div>
            </div>
        </form>
    </div>
</div>