<?php

namespace app\models;

use Yii;
use yii\db\Query;

/**
 * This is the model class for table "time_shift".
 *
 * @property integer $id
 * @property string $date
 * @property string $from_time
 * @property string $to_time
 * @property string $fullTime
 * @property integer $work_group_id
 */
class TimeShiftModel extends \yii\db\ActiveRecord
{

    const OneDay = 86400;
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'time_shift';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'date', 'from_time', 'to_time'], 'required'],
            [['id', 'work_group_id'], 'integer'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'from_time' => 'From Time',
            'to_time' => 'To Time',
            'work_group_id' => 'Work Group ID',
        ];
    }

    public function getFullTime() {
        return $this->from_time . " " . $this->to_time;
    }

    public static function get_week_days() {
        // calculate the days of current week
        $result = [];
        $day_of_week = date('N');
        $now = time();
        $day_of_week = $now - (static::OneDay * $day_of_week);

        for ($i=0 ; $i<7 ; $i++) {
            $day_of_week += static::OneDay;
            $result[] = ["day_of_week" => date("l", $day_of_week),"day" => date('d', $day_of_week), "month" => date('F', $day_of_week), "date" => date("Y-m-d", $day_of_week)];
        }
        return $result;
    }

    public static function search_time_shift($data, $work_group_id, $date) {
        $result = [];
        foreach ($data as $item) {
            if ($item['work_group_id'] == $work_group_id && $item['date'] == $date)
                $result[] = $item['from_time'].' - '.$item['to_time'];
        }
        return $result;
    }

    public static function divide_time_shifts_data($data) {
        $result = [
            "expired" => [],
            "present" => [],
            "dont_start" => []
        ];
        $now = date("H:m:s");
        foreach ($data as $item) {
            if ($item['from_time'] < $now && $item['to_time'] > $now) {
                $result['present'][] = $item;
            }
            else if ($item['to_time'] < $now) {
                $result['expired'][] = $item;
            }
            else {
                $result['dont_start'][] = $item;
            }
        }
        return $result;
    }

    public static function get_timeshifts_with_groups($date) {

        return (new Query())->select(['time_shift.*', 'work_group.*'])
            ->from(['time_shift', 'work_group'])
            ->where("time_shift.work_group_id = work_group.id")
            ->andWhere("time_shift.date = '".$date."'")
            ->all();
    }

    public static function get_pn_days($date) {
        // create prev and next days
        $result = [];
        if ($date === null) {
            $date = date("Y-m-d");
        }
        $part = explode("-", $date);
        $time = mktime(12,0,0, $part[1], $part[2], $part[0]);

        $result['time'] = $time;
        $result['this'] = $date;
        $result['prev'] = date("Y-m-d", $time - static::OneDay);
        $result['next'] = date("Y-m-d", $time + static::OneDay);

        return $result;
    }
}