<?php

/* @var $this yii\web\View */
/* @var $model \app\models\GuestModel */
/* @var $countries */

use yii\helpers\Url;
use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use yii\helpers\ArrayHelper;

$this->title = 'Guests for Restaurant Service';
?>

<div id="booking_contact_guest_regulations">
    <h1 class="page-header">Booking contact details and guest regulations</h1>
    <?php $form = ActiveForm::begin([
        'options' => [
            'class' => 'form-horizontal'
        ],
        'fieldConfig' => [
            'template' => "{label}<div class='col-sm-4'>{input}</div><p>{error}</p>",
            'labelOptions' => ['class' => 'col-sm-3 control-label']
        ],
    ]); ?>
        <fieldset>
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Booking Contact</h3>
                </div>
                <div class="panel-body">
                    <?= $form->field($model, 'name') ?>
                    <?= $form->field($model, 'organization') ?>
                    <?= $form->field($model, 'email') ?>
                    <?= $form->field($model, 'phone') ?>
                    <?= $form->field($model, 'country_id')->dropDownList(['' => 'choose a country'] + ArrayHelper::map($countries, 'id', 'fullName')) ?>
                    <div class="row">
                        <div class="col-sm-offset-3 col-sm-9">
                            <p> *) these fields must be filled<br/>
                                °) if applicable. We might give priority to a sponsor for example, if we get
                                multiple requests. </p>
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
        <fieldset>
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Guest regulations</h3>
                </div>
                <div class="panel-body">
                    <p> Welcome to the Restaurant Service booking request system. All bookings will be submitted
                        to WorldSkills International for final confirmation. <br/>
                        <br/>
                        Before proceeding with your booking please read and accept the guest regulations: </p>
                    <ul>
                        <li>Guests must be at the Restaurant Service area _15 minutes prior to scheduled seating
                            time.
                        </li>
                        <li>If guests are late (_maximum 5 minutes from allocated time_) their table will not be
                            guaranteed (so that Competitors are not disadvantaged, the tables will be given to
                            standby guests).
                        </li>
                        <li>Once seated – guests must accept all food and beverage that is offered, as
                            Competitors must be marked on all skill areas.
                        </li>
                        <li>Dietary requests cannot be accepted, as menu items must be the same for all
                            Competitors.
                        </li>
                        <li>No mobile phones, videos or cameras are permitted to be used.</li>
                        <li>Guests cannot leave the area until the meal service is completed unless approved by
                            Experts in the area (again this is so that no Competitor is disadvantaged with
                            service).
                        </li>
                        <li>Guests will _not sit_ at the tables where the Competitor is from the same country as
                            the guests.
                        </li>
                        <li>Guest are invited as guests of WorldSkills, they are not to judge the Competitor or
                            interfere with the Competitor in their work or cause disruption to their work or
                            make comments to judges about any of the Competitors.
                        </li>
                        <li>Guest must be legal drinking age according to the Host Country regulations (i.e. 18
                            in Brazil).
                        </li>
                    </ul>
                    <div class="checkbox">
                        <?= $form->field($model, 'agree')->checkbox()->label('I agree to the guest regulations and confirm that myself and any guests (group booking) will respect all of the guest regulations') ?>
                    </div>
                </div>
            </div>
        </fieldset>
    <?= Html::submitButton('Continue booking for<strong> an individual</strong>', ['class' => 'btn btn-primary', 'name' => 'book-individual', 'value' => '1']) ?>
    <?= Html::submitButton('Continue booking for<strong> an group</strong>', ['class' => 'btn btn-primary', 'name' => 'book-group', 'value' => '1']) ?>

    <?php ActiveForm::end(); ?>
</div>