<?php

namespace app\controllers;

use app\models\BookModel;
use app\models\DaysModel;
use app\models\DiningModel;
use app\models\GuestModel;
use yii\base\Model;
use yii\web\Controller;
use Yii;

class ManagementController extends Controller
{
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ]
        ];
    }

    public function beforeAction($action)
    {
        $this->enableCsrfValidation = false;

        return parent::beforeAction($action); // TODO: Change the autogenerated stub
    }

    public function actionIndex()
    {
        $books = BookModel::find()
            ->join('JOIN', 'days', "book.day_id=days.id")
            ->join('JOIN', 'dining', "book.dining_id=dining.id")
            ->orderBy('`days`.name ASC, dining.hours ASC, book.id ASC')
            ->indexBy('id')
            ->all();

        if (Yii::$app->request->post('save-confirmations') && Yii::$app->request->post('actionBook')) {
            $actions = Yii::$app->request->post('actionBook');
            foreach ($actions as $index => $action) {
                $books[$index]['state'] = $action['state'];
                $books[$index]['day_id'] = @$action['day_id'] ? $action['day_id'] : $books[$index]['day_id'];
                $books[$index]['dining_id'] = @$action['dining_id'] ? $action['dining_id'] : $books[$index]['dining_id'];
                $books[$index]->save();
            }
        }

        if (Yii::$app->request->post('send-emails')) {
            BookModel::sendEmails();
        }

        if (Yii::$app->request->post('create-guest-list')) {
            $guests = BookModel::getGuestList();
            $content = "";
            foreach ($guests as $guest)
            {
                $content .= $guest['id'].','.$guest['g_name'].','.$guest['organization']
                    .','.$guest['guest_name'].','.$guest['short_name']."\n";
            }

            return Yii::$app->response->sendContentAsFile($content, 'list.csv', ['mimeType' => 'text/csv']);
        }

        $days = DaysModel::find()->orderBy('name ASC')->all();
        $dins = DiningModel::find()->orderBy('hours ASC')->all();

        return $this->render('index', [
            'books' => $books,
            'days' => $days,
            'dins' => $dins
        ]);
    }
}