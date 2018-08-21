<?php

/* @var $this yii\web\View */
/* @var $model \app\models\GuestModel */
/* @var $days \app\models\DaysModel[] */
/* @var $dining \app\models\DiningModel[] */
/* @var $countries[] */
/* @var $available_books[] */

use yii\helpers\Url;
use yii\helpers\Html;
use yii\widgets\ActiveForm;
use yii\helpers\ArrayHelper;
use app\models\BookModel;

$this->title = 'Guests for Restaurant Service';
?>
<select id="countries" class="form-control" style="display: none" name="">
    <?php foreach ($countries as $index => $country) { ?>
        <option value="<?= $index ?>"><?= $country ?></option>
    <?php } ?>
</select>

<div id="booking_request">
    <h1 class="page-header">Booking request</h1>

    <!-- individual (depending on selected button on form before) -->
    <form action="<?= Url::to(['site/set-books']) ?>" method="post">
        <fieldset>
            <legend>Group</legend>
            <p>Booking a group</p>
            <!-- message -->
            <div class="error-message"></div>
            <!-- Nav tabs -->
            <ul class="nav nav-tabs" role="tablist">
                <?php foreach ($days as $index => $day) { ?>
                    <li role="presentation" <?php if ($index == 0) echo "class='active'" ?>><a href="#<?= $day->name ?>" aria-controls="<?= $day->name ?>" role="tab" data-toggle="tab"><?= $day->name ?>: <?= $day->holding_date ?></a></li>
                <?php } ?>
            </ul>
            <!-- Tab panes -->
            <div class="tab-content">
                <?php foreach ($days as $index => $day) { ?>
                    <div role="tabpanel" class="tab-pane <?php if ($index == 0) echo 'active'; ?>" id="<?= $day->name ?>">
                        <div class="table-responsive">
                            <table class="table table-bordered table-striped">
                                <thead>
                                <tr>
                                    <th>Dining experience</th>
                                    <th>Number of seats available<br/>
                                        Number of guests to be seated
                                    </th>
                                    <th>Guest names (if known)</th>
                                    <th>Guest country*</th>
                                </tr>
                                </thead>
                                <tbody>
                                <?php foreach ($dining as $din) { ?>
                                <tr data-day-id="<?= $day->id ?>"
                                    data-din-id="<?= $din->id ?>">
                                    <td><?= $din->name ?><br/><?= $din->hours ?></td>
                                    <td>
                                        available: <?php
                                        $count = $day->getBooks()->where("dining_id='{$din->id}'")->count(); echo (BookModel::RIVALS_COUNT * $din->capacity_for_rival) - $count; ?> <br/>
                                        <button type="button" class="btn btn-default addguest">+ Add guest</button>
                                    </td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <?php } ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                <?php } ?>
            </div>
        </fieldset>
        <button class="btn btn-primary" type="submit" name="book-group">Submit booking request</button>
    </form>

</div>