<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "dining".
 *
 * @property integer $id
 * @property string $name
 * @property string $hours
 * @property integer $capacity_for_rival
 *
 * @property BookModel[] $books
 */
class DiningModel extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'dining';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name', 'hours', 'capacity_for_rival'], 'required'],
            [['capacity_for_rival'], 'integer'],
            [['name', 'hours'], 'string', 'max' => 100],
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
            'hours' => 'Hours',
            'capacity_for_rival' => 'Capacity For Rival',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getBooks()
    {
        return $this->hasMany(BookModel::className(), ['dining_id' => 'id']);
    }
}
