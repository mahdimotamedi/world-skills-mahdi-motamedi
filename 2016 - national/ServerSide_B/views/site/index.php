<?php

/* @var $this yii\web\View */

use yii\helpers\Url;
use yii\helpers\Html;

$this->title = 'Guests for Restaurant Service';
?>
<ol class="breadcrumb">
    <li><a href="#">Home</a></li>
    <li class="active">Information</li>
</ol>
<div id="content">

    <!-- for guest only - begin -->
    <div id="dining_experience_descriptions">
        <div class="">
            <div class="row">
                <div class="col-xs-6">
                    <h1>Guests in Restaurant Service</h1>
                    <p class="clearfix">Become part of the competition: be a guest in Restaurant Service competition
                        by requesting a seat and enjoy one of the different dining experiences!</p>
                </div>
                <div class="col-xs-offset-2 col-xs-4 col-sm-offset-4 col-sm-2">
                    <h1><img src="<?= Url::to('@web/img/6215177259.jpg') ?>" alt="cook in restaurant service"
                             class="img-thumbnail img-responsive"></h1>
                </div>
            </div>
            <h3>Dining experience desriptions</h3>
            <table class="table table-bordered">
                <colgroup>
                    <col style="width: 25%">
                    <col style="width: 25%">
                    <col style="width: 25%">
                    <col style="width: 25%">
                </colgroup>
                <thead>
                <tr>
                    <th>Casual Dining</th>
                    <th>Bar Service</th>
                    <th>Fine Dining</th>
                    <th>Banquet Dining</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>This dining is like a bistro/café.</td>
                    <td>Casual service for sandwiches, cakes, cheese plates, salads, alcoholic and non-alcoholic
                        beverages. Guests can choose from a limited menu. Competitors will prepare international
                        cocktails and serve with light snacks.
                    </td>
                    <td>This is formal dining with a four course set menu with alcoholic beverages. The service
                        includes the waiter preparing all dishes at the table by flambé, carving or assembling.
                        Appropriate for VIPs.
                    </td>
                    <td>This is a three course set menu with coffee and alcoholic beverages in a banquet format.
                    </td>
                </tr>
                </tbody>
            </table>
            <form action="">
                <button class="btn btn-primary" type="button" onclick="location='<?= Url::to(['site/start-booking']) ?>'" name="start-booking">Start booking</button>
            </form>
        </div>
    </div>
