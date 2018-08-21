<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "role".
 *
 * @property integer $id
 * @property string $title
 * @property integer $admin_access
 */
class RoleModel extends \yii\db\ActiveRecord
{
    const ADMIN_ACCESS_ACTIVE = 1;
    const ADMIN_ACCESS_INACTIVE = 0;
    const MAIN_ADMIN_ID = 13;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'role';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['title'], 'required'],
            [['admin_access'], 'integer'],
            [['title'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'آی دی',
            'title' => 'عنوان',
            'admin_access' => 'حق دسترسی مدیریتی',
            'admin_accessText' => 'حق دسترسی مدیریتی',
        ];
    }
}
