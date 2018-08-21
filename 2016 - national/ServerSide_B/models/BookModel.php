<?php

namespace app\models;

use Yii;
use yii\db\Query;
use yii\helpers\BaseFileHelper;
use yii\helpers\Url;

/**
 * This is the model class for table "book".
 *
 * @property integer $id
 * @property string $guest_name
 * @property integer $country_id
 * @property integer $guest_id
 * @property integer $state
 * @property string $stateText
 * @property integer $day_id
 * @property integer $dining_id
 *
 * @property DiningModel $dining
 * @property GuestModel $guest
 * @property DaysModel $day
 * @property CountryModel $country
 */
class BookModel extends \yii\db\ActiveRecord
{

    // states
    const STATE_REQUESTED = 0;
    const STATE_CONFIRM = 1;
    const STATE_DECLINE = 2;
    const STATE_WAIT_LIST = 3;

    const RIVALS_COUNT = 6;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'book';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['country_id', 'guest_id', 'day_id', 'dining_id'], 'required'],
            [['country_id', 'guest_id', 'state', 'day_id', 'dining_id'], 'integer'],
            [['guest_name'], 'string', 'max' => 100],
            [['dining_id'], 'exist', 'skipOnError' => true, 'targetClass' => DiningModel::className(), 'targetAttribute' => ['dining_id' => 'id']],
            [['guest_id'], 'exist', 'skipOnError' => true, 'targetClass' => GuestModel::className(), 'targetAttribute' => ['guest_id' => 'id']],
            [['day_id'], 'exist', 'skipOnError' => true, 'targetClass' => DaysModel::className(), 'targetAttribute' => ['day_id' => 'id']],
            [['country_id'], 'exist', 'skipOnError' => true, 'targetClass' => CountryModel::className(), 'targetAttribute' => ['country_id' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'guest_name' => 'Guest Name',
            'country_id' => 'Country ID',
            'guest_id' => 'Guest ID',
            'state' => '',
            'day_id' => 'Day ID',
            'dining_id' => 'Dining ID',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getDining()
    {
        return $this->hasOne(DiningModel::className(), ['id' => 'dining_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getGuest()
    {
        return $this->hasOne(GuestModel::className(), ['id' => 'guest_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getDay()
    {
        return $this->hasOne(DaysModel::className(), ['id' => 'day_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCountry()
    {
        return $this->hasOne(CountryModel::className(), ['id' => 'country_id']);
    }

    public function getStateText()
    {
        $state = '';
        switch ($this->state) {
            case static::STATE_REQUESTED:
                $state = 'requested';
                break;

            case static::STATE_CONFIRM:
                $state = 'confirmed';
                break;

            case static::STATE_DECLINE:
                $state = 'declined';
                break;

            case static::STATE_WAIT_LIST:
                $state = 'waitlisted';
                break;
        }

        return $state;
    }

    static function getGuestList()
    {
        $query = (new Query)
            ->select(['book.*','guest.name AS g_name','guest.organization','country.short_name'])
            ->from('book,guest,country')
            ->where('book.state = \''. self::STATE_CONFIRM .'\' AND book.guest_id = guest.id AND book.country_id = country.id');

        return $query->all();
    }

    static function sendEmails()
    {
        $guests = GuestModel::find()->all();
        $content = "";

        foreach ($guests as $guest)
        {
            $content .= "
            Booking confirmation\n\n
            {$guest->name}\n\n
            We are happy to send you the latest information about guest confirmation\n\n
            ";

            $books = $guest->books;
            foreach ($books as $book)
            {
                $content .= "
                {$book->day->name} {$book->guest_name} : {$book->stateText}\n
                ";
            }

            $content .= "\nPlease note that your guests need to arrive to Restaurant Service at lest 10 minutes prior to thescheduled\n\n
            ========================================\n\n";
        }

        file_put_contents(Url::to('@webroot').'/../emails/email.txt', $content);
    }
}