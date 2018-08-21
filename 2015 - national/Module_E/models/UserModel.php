<?php

namespace app\models;

use Yii;
use yii\db\Query;
use yii\web\IdentityInterface;
use yii\web\UploadedFile;

/**
 * This is the model class for table "user".
 *
 * @property integer $id
 * @property string $fname
 * @property string $lname
 * @property string $email
 * @property string $password
 * @property integer $role_id
 * @property string $picture
 */
class UserModel extends \yii\db\ActiveRecord implements IdentityInterface
{

    const SCENARIO_LOGIN = 'login';
    const SCENARIO_ADD_EXPERT = 'add_user';
    const SCENARIO_SEARCH = 'search';

    /**
     * @var UploadedFile
     */
    public $avatar_pic;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'user';
    }

    public function scenarios()
    {
        return [
            self::SCENARIO_LOGIN => ['email', 'password'],
            self::SCENARIO_ADD_EXPERT => ['id', 'email', 'password', 'fname', 'lname', 'role_id', 'avatar_pic', 'picture'],
            self::SCENARIO_SEARCH => ['fname'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['email', 'password', 'fname', 'avatar_pic', 'role_id'], 'required', 'on' => [self::SCENARIO_LOGIN, self::SCENARIO_ADD_EXPERT]],
            [['email'], 'filter', 'filter'=>'strtolower'],
            [['email'], 'unique', 'on' => static::SCENARIO_ADD_EXPERT],
            [['email'], 'email'],
            [['role_id'], 'integer'],
            [['fname', 'lname', 'email', 'password', 'picture'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'آی دی',
            'fname' => 'نام',
            'lname' => 'نام خانوادگی',
            'email' => 'آدرس رایانامه',
            'password' => 'رمز عبور',
            'role_id' => 'نقش (گروه کاربری)',
            'avatar_pic' => 'نیمرخ (آواتار)',
        ];
    }

    public static function findIdentity($id)
    {
        return static::findOne($id);
    }

    /**
     * @inheritdoc
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
    }

    /**
     * @inheritdoc
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @inheritdoc
     */
    public function getAuthKey()
    {
    }

    /**
     * @inheritdoc
     */
    public function validateAuthKey($authKey)
    {
    }

    /**
     * Validates password
     *
     * @param string $password password to validate
     * @return boolean if password provided is valid for current user
     */
    public function validatePassword($password)
    {
        return $this->password === $password;
    }

    public function check_user_login()
    {
        return static::findOne(['email' => $this->email, 'password' => $this->password]);
    } 

    static function get_experts_data($fname = "") {
        $query = (new Query())
            ->select(['user.*', 'role.title'])
            ->from("user,role")
            ->where("user.role_id = role.id AND user.id != ".Yii::$app->user->id);

        // if filter is in request
        if ($fname)
            $query->andWhere(['LIKE' ,'fname', $fname]);

        return $query->all();
    }

    public function upload_avatar()
    {
        if (!$this->avatar_pic)
            return false;

        // set a random string for file name
        $this->avatar_pic->name = Yii::$app->security->generateRandomString() . '.' . $this->avatar_pic->extension;
        $this->picture = $this->avatar_pic->name;

        $this->avatar_pic->saveAs("upload/".$this->avatar_pic->name);
        return true;
    }

    public static function hasAdminAccess()
    {
        $role = RoleModel::findOne(['id' => Yii::$app->user->identity['role_id']]);
        return $role->admin_access == RoleModel::ADMIN_ACCESS_ACTIVE;
    }
}
