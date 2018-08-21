<?php

/* @var $this yii\web\View */
/* @var $groups \app\models\GroupsModel[] */
/* @var $time_shifts */
/* @var $week_days */
/* @var $model \app\models\TimeShiftModel */

use yii\helpers\Url;
use yii\helpers\Html;
use yii\helpers\ArrayHelper;
use yii\widgets\ActiveForm;
use app\assets\AppAsset;

$this->title = 'schedules';

$this->registerJsFile("@web/js/moments.js", ['depends' => AppAsset::className()]);
$this->registerJsFile("@web/js/schedules.js", ['depends' => AppAsset::className()]);
?>

<div id="content" class="schedules index user-type-id-2">
    <h2 class="heading-with-button">
        <span>زمان بندی گروه های گروه</span>
    </h2>
    <script type="text/javascript">
        var is_shift_blocks = false;

        if (typeof(hideShow) == 'undefined') {
            hideShow = function () {
                alert(Shifts.Lang.get('schedules.try_again'));
            }
        }
    </script>
    <form action="<?= Url::to(['site/save-time-shift']) ?>" class="no-bg" id="ScheduleSaveForm" method="post" accept-charset="utf-8">
        <div style="display:none;"><input type="hidden" name="_method" value="POST"/></div>
        <input type="hidden" name="schedule_date" id="schedule-date" value="2014-04-06"/>
        <div id="employers-overview">
            <div id="notice-labor-costs">
                <div id="notice-labor-costs-loader" class="grey-loader"></div>
                <div id="notice-labor-costs-tallies" style="display:none;">
                    <span id="notice-hours"></span>
                    <span class="sep">|</span>
                    <span id="notice-labor"></span>
                    <div class="clear"></div>
                </div>
            </div>
            <table id="schedule-table">
                <thead>
                <!-- Name | Days of Week -->
                <tr class="main-sched-heading">
                    <th class="th">عنوان گروه کاری</th>
                    <!-- تاریخ هر مورد از data-date گرفته می شود-->
                    <?php foreach ($week_days as $week_day) { ?>
                        <th class="th" data-date="<?= $week_day['date'] ?>">
                            <?= $week_day['day_of_week'] ?>
                            <div><?= $week_day['day']." ".$week_day['month'] ?></div>
                        </th>
                    <?php } ?>
                </tr>
                </thead>


                <tbody>
                <?php foreach ($groups as $group) { ?>
                    <!-- گروه کاربری از data-group گرفته می شود -->
                    <tr class="row-user-id-" data-group="<?= $group['id'] ?>">
                        <td class="name-col employee-notes">
                            <div class="name"><?= $group['title'] ?></div>
                        </td>
                        <?php foreach ($week_days as $week_day) { ?>
                            <td class="day">
                                <?php
                                $times = $group->getTimeShifts()->where("date='{$week_day['date']}'")->all();
                                foreach ($times as $time) { ?>
                                    <div class="xe"><div class="times"><a class="sched_anchors" href="#"><?= $time->fullTime ?></a><div class="clear"></div></div></div>
                                <?php } ?>
                                <a class="btn btn-default add-shift" href="#" title="">
                                    <span class="glyphicon glyphicon-plus"></span>
                                </a>
                                <div class="clear"></div>
                            </td>
                        <?php } ?>
                    </tr>
                <?php } ?>
                </tbody>
            </table>
    </form>
</div>

<!-- /#left -->
<div id="shift-trash">
    <span class="glyphicon glyphicon-trash"></span>
</div>
<div id="day-graph-dialog" title="Day graph" style="display:none"></div>
<div id="time-overlay" class="rounded" style="display:none">
    <div class="time-overlay-titlebar">
        <div class="time-overlay-title"></div>
        <a href="#" class="shift-cancel">x</a>
        <div class="clear"></div>
    </div>
    <div class="inner">
        <div class="shift-avail-content"></div>
        <div class="time-bar-wrap">
            <div class="time-bar-custom-inputs">
                <input type="text" class="time-input start" placeholder="9am" value="12:00:00" />
                <div class="arrow">&rarr;</div>
                <input type="text" class="time-input end" placeholder="5:30pm" value="12:45:00" />
                <div class="clear"></div>
            </div>
        </div>
        <div class="user-role-wrap"></div>
        <input type="text" class="shift-notes" placeholder="Shift notes..."/>
        <input type="button" class="shift-save btn btn-success" value="Save"/>
        <div class="clear"></div>
    </div>
</div>
<div id="notice-saving-shift" class="schedule-auto-saving">در حال دخیره سازی...</div>
