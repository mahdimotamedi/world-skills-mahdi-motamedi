<?php

/* @var $this yii\web\View */
/* @var $time_shifts */
/* @var $date */
/* @var $thisDate */

use yii\helpers\Url;

$this->title = 'Home';
?>

<div id="content" class="employers index user-type-id-2">



    <h2>
        گروه‌های کاری
        <div class="btn-group">
            <a class="day-arrow btn btn-default"  href="<?= Url::to(['site/index', 'date' => $date['next']]) ?>" data-date="2014-04-11">
            <span class="glyphicon glyphicon-arrow-left">
            </span>
            </a>
            <a id="working-today-dp-trigger" href="<?= Url::to(['site/index', 'date' => $date['this']]) ?>" class="btn btn-default">
                <?= $thisDate ?>
            </a>
            <a class="day-arrow btn btn-default" href="<?= Url::to(['site/index', 'date' => $date['prev']]) ?>" data-date="2014-04-13">
            <span class="glyphicon glyphicon-arrow-right">
            </span>
            </a>
        </div>
        <div class="clear">
        </div>
    </h2>


    <div>
        <div class="black-loader" id="working-today-loader" style="display:none;">
        </div>
        <div id="working-today-tabs">

            <div class="widget">
                <h3>
                    گروه کاری شروع نشده
                </h3>
                <div class="widget-content location-graph">
                    <ul>
                        <?php foreach ($time_shifts['dont_start'] as $time_shift) { ?>
                            <li><a href="<?= Url::to(['site/edit-group', 'id' => $time_shift['work_group_id']]) ?>"><?= $time_shift['title'] ?></a><span><?= $time_shift['from_time'] ?> - <?= $time_shift['to_time'] ?></span></li>
                        <?php } ?>
                    </ul>
                </div>
            </div>
            <div class="widget">
                <h3>
                    گروه کاری در حال انجام
                </h3>
                <div class="widget-content location-graph">
                    <ul>
                        <?php foreach ($time_shifts['present'] as $time_shift) { ?>
                            <li><a href="<?= Url::to(['site/edit-group', 'id' => $time_shift['work_group_id']]) ?>"><?= $time_shift['title'] ?></a><span><?= $time_shift['from_time'] ?> - <?= $time_shift['to_time'] ?></span></li>
                        <?php } ?>
                    </ul>
                </div>
            </div>

            <div class="widget">
                <h3>
                    گروه کاری منقضی شده
                </h3>
                <div class="widget-content location-graph">
                    <ul>
                        <?php foreach ($time_shifts['expired'] as $time_shift) { ?>
                            <li><a href="<?= Url::to(['site/edit-group', 'id' => $time_shift['work_group_id']]) ?>"><?= $time_shift['title'] ?></a><span><?= $time_shift['from_time'] ?> - <?= $time_shift['to_time'] ?></span></li>
                        <?php } ?>
                    </ul>
                </div>
            </div>
        </div>
        <!-- /#left -->

        <div style="clear:both;">
        </div>