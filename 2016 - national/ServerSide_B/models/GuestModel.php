<?php

namespace app\models;

use Yii;
use app\models\CountryModel;

/**
 * This is the model class for table "guest".
 *
 * @property integer $id
 * @property string $name
 * @property string $organization
 * @property string $email
 * @property string $phone
 * @property integer $country_id
 *
 * @property CountryModel $country
 * @property DaysModel[] $days
 * @property BookModel[] $books
 * @property string $agree
 */
class GuestModel extends \yii\db\ActiveRecord
{
    public $agree;

    const SCENARIO_START_BOOKING = 'start_booking';

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'guest';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name', 'email', 'country_id'], 'required'],
            [['email'], 'email'],
            [['country_id'], 'integer'],
            [['name', 'organization', 'email'], 'string', 'max' => 100],
            [['phone'], 'string', 'max' => 40],
            [['country_id'], 'exist', 'skipOnError' => true, 'targetClass' => CountryModel::className(), 'targetAttribute' => ['country_id' => 'id']],

            [['agree'], 'required', 'requiredValue'=>'1', 'message' => 'You should accept term to sent request for reserve.', 'on' => self::SCENARIO_START_BOOKING],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'organization' => 'Organization °',
            'email' => 'Email',
            'phone' => 'Phone',
            'country_id' => 'Country',
        ];
    }

    public function scenarios()
    {
        $scenarios = parent::scenarios();
        $scenarios[self::SCENARIO_START_BOOKING] = ['id', 'name', 'organization', 'email', 'phone', 'country_id', 'agree'];
        return $scenarios;
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCountry()
    {
        return $this->hasOne(CountryModel::className(), ['id' => 'country_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getBooks()
    {
        return $this->hasMany(BookModel::className(), ['guest_id' => 'id']);
    }

    public function getDays()
    {
        return $this->hasMany(DaysModel::className(), ['id' => 'day_id'])
            ->viaTable(BookModel::tableName(), ['guest_id' => 'id']);
    }
}
