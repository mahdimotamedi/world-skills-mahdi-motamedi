<?php

namespace app\models;

use Yii;
use yii\db\Query;
use app\models\TaskModel;
use app\models\UserModel;

/**
 * This is the model class for table "work_group".
 *
 * @property integer $id
 * @property string $title
 * @property TaskModel[] $tasks
 * @property UserModel[] $users
 * @property TimeShiftModel[] $timeShifts
 */
class GroupsModel extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'work_group';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['title'], 'required'],
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
        ];
    }

    public static function get_groups_info() {

        $query = (new Query())->select(['work_group.*', 'count(task.id) as count_experts', 'count(time_shift.id) as count_time_shifts'])
            ->from(['work_group', 'task', 'time_shift'])
            ->where("work_group.id = task.work_group_id")
            ->andWhere("work_group.id = time_shift.work_group_id")
            ->groupBy('work_group.id');
        return $query->all();

    }

    public function getTasks() {
        return $this->hasMany(TaskModel::className(), ['work_group_id' => 'id']);
    }

    public function getTimeShifts() {
        return $this->hasMany(TimeShiftModel::className(), ['work_group_id' => 'id']);
    }

    public function getUsers() {
        return $this->hasMany(UserModel::className(), ['id' => 'user_id'])
            ->via('tasks');
    }

    public function getRoles() {
        return $this->hasMany(RoleModel::className(), ['id' => 'role_id'])
            ->via('users');
    }
}
