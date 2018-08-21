<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "days".
 *
 * @property integer $id
 * @property string $name
 * @property string $holding_date
 *
 * @property BookModel[] $books
 */
class DaysModel extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'days';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name', 'holding_date'], 'required'],
            [['holding_date'], 'safe'],
            [['name'], 'string', 'max' => 100],
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
            'holding_date' => 'Holding Date',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getBooks()
    {
        return $this->hasMany(BookModel::className(), ['day_id' => 'id']);
    }
}
