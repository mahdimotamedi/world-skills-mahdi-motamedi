<?php

/* @var $this yii\web\View */
/* @var $guest \app\models\GuestModel */
/* @var $books \app\models\BookModel[] */

use yii\helpers\Url;
use yii\helpers\Html;
use yii\widgets\ActiveForm;
use yii\helpers\ArrayHelper;

$this->title = 'Guests for Restaurant Service';
?>

<div id="submission_confirmation">
    <h1 class="page-header">Submission confirmation</h1>
    <p> <?= $guest->name ?>,<br/>
        <br/>
        Thank you for your booking request <?= $guest->id ?>.<br/>
        <br/>
        You have requested booking for the following guests: </p>
    <ul>
        <?php foreach ($books as $book) { ?>
            <li><?= $book->day->name ?> - <?= $book->day->holding_date ?>, <?= $book->dining->name ?> <?= $book->dining->hours ?> <br/>
                for <?= $book->guest_name ?> <?= $book->country->short_name ?>
            </li>
        <?php } ?>
    </ul>
    <p> Please note that these booking requests will need to be reviewed and confirmed by WSI. <br/>
        You will receive an email with the confirmation as soon as possible. </p>
</div>