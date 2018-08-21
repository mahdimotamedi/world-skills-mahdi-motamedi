<?php

/* @var $this yii\web\View */
/* @var $model \app\models\GuestModel */
/* @var $days \app\models\DaysModel[] */
/* @var $dining \app\models\DiningModel[] */
/* @var $available_books[] */

use yii\helpers\Url;
use yii\helpers\Html;
use yii\widgets\ActiveForm;
use yii\helpers\ArrayHelper;
use app\models\BookModel;

$this->title = 'Guests for Restaurant Service';
?>

<div id="booking_request">
    <h1 class="page-header">Booking request</h1>

    <!-- individual (depending on selected button on form before) -->
    <form method="post" action="<?= Url::to(['site/set-books']) ?>">
        <fieldset>
            <legend>Individual</legend>
            <p>Booking an individual guest</p>
            <div class="table-responsive">
                <table class="table table-bordered table-striped">
                    <thead>
                    <tr>
                        <th>Dining experience</th>
                        <?php foreach ($days as $day) { ?>
                            <th><?= $day->name . ": " . $day->holding_date ?></th>
                        <?php } ?>
                    </tr>
                    </thead>
                    <tbody>
                    <?php foreach ($dining as $din) { ?>
                        <tr>
                            <td><?= $din->name ?><br/><?= $din->hours ?></td>

                            <?php foreach ($days as $day) { ?>
                                <td>available: <?php $count = $day->getBooks()->where("dining_id='{$din->id}'")->count(); echo (BookModel::RIVALS_COUNT * $din->capacity_for_rival) - $count; ?>
                                    <input type="checkbox" name="book[<?= $day->id . '-' . $din->id ?>][][]" value="1"></td>
                            <?php } ?>
                        </tr>
                    <?php } ?>
                    </tbody>
                </table>
            </div>
            <p>Please note that most seating take place at the same time and you are not allowed to change once
                seated.<br/>
                For a seating that is full, you will be waitlisted.</p>
        </fieldset>
        <button class="btn btn-primary" type="submit" name="book-individual">Submit booking request</button>
    </form>

</div>