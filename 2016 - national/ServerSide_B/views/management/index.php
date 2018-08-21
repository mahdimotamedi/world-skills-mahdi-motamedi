<?php
/* @var $this yii\web\View */
/* @var $books \app\models\BookModel[] */
/* @var $days \app\models\DaysModel[] */
/* @var $dins \app\models\DiningModel[] */

use yii\helpers\Url;
use yii\helpers\Html;
use yii\widgets\ActiveForm;
use yii\helpers\ArrayHelper;

$this->title = "Management reservation";
?>

<select id="days" name="" style="display: none;" class="form-control">
    <?php foreach ($days as $day) {
        echo "<option value='{$day->id}'>{$day->name}</option>\n";
    } ?>
</select>

<select id="dins" name="" style="display: none;" class="form-control">
    <?php foreach ($dins as $din) {
        echo "<option value='{$din->id}'>{$din->name} {$din->hours}</option>\n";
    } ?>
</select>

<div id="reservation_management">
    <h1>Reservation management</h1>
    <form method="post">
        <fieldset>
            <div class="table-responsive">
                <table class="table table-bordered table-striped">
                    <colgroup>
                        <col style="width: 8%">
                        <col style="width: 27%">
                        <col style="width: 10%">
                        <col style="width: 30%">
                        <col style="width: 10%">
                        <col style="width: 5%">
                        <col style="width: 5%">
                        <col style="width: 5%">
                        <col style="width: 5%">
                    </colgroup>
                    <thead>
                    <tr>
                        <th rowspan="2">Day</th>
                        <th rowspan="2">Seating</th>
                        <th rowspan="2">Booking No.</th>
                        <th rowspan="2">Guests</th>
                        <th rowspan="2">Status</th>
                        <th colspan="4">Action</th>
                    </tr>
                    <tr>
                        <th>Confirm</th>
                        <th>Decline</th>
                        <th>Waitlist</th>
                        <th>Reschedule</th>
                    </tr>
                    </thead>
                    <tbody>
                    <?php foreach ($books as $book) { ?>
                        <tr data-id="<?= $book->id ?>">
                            <td class="day_td" data-id="<?= $book->day->id ?>"><?= $book->day->name ?></td>
                            <td class="din_td" data-id="<?= $book->dining->id ?>"><?= $book->dining->name. ' ' . $book->dining->hours ?></td>
                            <td><span title="<?= $book->guest->name . ', ' . $book->guest->organization . ', ' . $book->guest->phone . ', ' . $book->guest->email . ', ' . $book->guest->country->short_name ?>"><?= $book->guest->id ?></span>
                            </td>
                            <td><?= $book->guest_name . ' ' . $book->country->short_name ?></td>
                            <td><?= $book->stateText ?></td>
                                <?php if ($book->state == $book::STATE_REQUESTED) { ?>
                            <td><p class="text-center">
                                    <input type="radio" name="actionBook[<?= $book->id ?>][state]" value="<?= $book::STATE_CONFIRM ?>">
                                </p></td>
                            <td><p class="text-center">
                                    <input type="radio" name="actionBook[<?= $book->id ?>][state]" value="<?= $book::STATE_DECLINE ?>">
                                </p></td>
                            <td><p class="text-center">
                                    <input type="radio" name="actionBook[<?= $book->id ?>][state]" value="<?= $book::STATE_WAIT_LIST ?>">
                                </p></td>
                            <td><p class="text-center">
                                    <input type="radio" name="actionBook[<?= $book->id ?>][state]" value="reschedule" class="reschedule_radio">
                                </p></td>
                                <?php } else echo "<td colspan='4'></td>" ?>
                        </tr>
                    <?php } ?>
                    </tbody>
                </table>
            </div>
        </fieldset>
        <button class="btn btn-default" type="submit" name="create-guest-list" value="1">Create guest list</button>
        <button class="btn btn-default" type="submit" name="send-emails" value="1">Send emails</button>
        <button class="btn btn-primary" type="submit" name="save-confirmations" value="1">Save changes</button>
    </form>
</div>