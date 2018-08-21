<?php
class game {
    public $state;
    public $picture;
    public $p_score;
    public $c_score;
    public $game_table;
    public $winner;
    public $time_seconds;
    private $start_time;

    function __construct()
    {
        $this->winner = $_SESSION['game']['winner'] ? $_SESSION['game']['winner'] : null;
        $this->state = $_SESSION['game']['state'] ? $_SESSION['game']['state'] : 0;
        $this->picture = $_SESSION['game']['picture'] ? $_SESSION['game']['picture'] : "";
        $this->p_score = $_SESSION['game']['p_score'] ? $_SESSION['game']['p_score'] : 0;
        $this->c_score = $_SESSION['game']['c_score'] ? $_SESSION['game']['c_score'] : 0;
        $this->start_time = $_SESSION['game']['start_time'] ? $_SESSION['game']['start_time'] : time();
        $this->time_seconds = $_SESSION['game']['time_seconds'] ? $_SESSION['game']['time_seconds'] : null;
        $this->game_table = $_SESSION['game']['game_table']
            ? $_SESSION['game']['game_table'] : [
                1=>null, 2=>null, 3=>null,
                4=>null, 5=>null, 6=>null,
                7=>null, 8=>null, 9=>null
            ];
    }

    function start()
    {
        $this->state = 1;
        $_SESSION['game']['state'] = $this->state;

        $this->start_time = time();
        $_SESSION['game']['start_time'] = $this->start_time;
    }

    function restart()
    {
        unset($_SESSION['game']);
        $_SESSION['game']['picture'] = $this->picture;
        $this->start();
    }

    function get_time()
    {
        return time() - $this->start_time;
    }

    function set_player_pick($id)
    {
        $this->game_table[$id] = 'p';
        $_SESSION['game']['game_table'] = $this->game_table;

        $this->p_score++;
        $_SESSION['game']['p_score'] = $this->p_score;

        $this->check_winnings();
    }

    function create_computer_pick()
    {
        $range = [];
        foreach ($this->game_table as $i => $item) {
            if ($item == null)
                $range[] = $i;
        }

        $random = rand(0, count($range)-1);
        $this->game_table[$range[$random]] = 'c';
        $_SESSION['game']['game_table'] = $this->game_table;

        $this->c_score++;
        $_SESSION['game']['c_score'] = $this->c_score;

        $this->check_winnings();

        return $range[$random];
    }

    function check_winnings()
    {
        $g = $this->game_table;

        // in rows
        if ($g[1] == $g[2] && $g[2] == $g[3])
            $this->winner = $g[1];
        else if ($g[4] == $g[5] && $g[5] == $g[6])
            $this->winner = $g[4];
        else if ($g[7] == $g[8] && $g[8] == $g[9])
            $this->winner = $g[7];

        // in cols
        else if ($g[1] == $g[4] && $g[4] == $g[7])
            $this->winner = $g[1];
        else if ($g[2] == $g[5] && $g[5] == $g[8])
            $this->winner = $g[2];
        else if ($g[3] == $g[6] && $g[6] == $g[9])
            $this->winner = $g[3];

        // in diameter
        else if ($g[1] == $g[5] && $g[5] == $g[9])
            $this->winner = $g[1];
        else if ($g[3] == $g[5] && $g[5] == $g[7])
            $this->winner = $g[3];


        $_SESSION['game']['winner'] = $this->winner;

        if ($this->winner) {
            $this->time_seconds = time() - $this->start_time;
            $_SESSION['game']['time_seconds'] = $this->time_seconds;

            $this->state = 0;
            $_SESSION['game']['state'] = $this->state;
        }

        return $this->winner;
    }

    function upload_image($image)
    {
        $mime_type = mime_content_type($image['tmp_name']);
        switch ($mime_type) {
            case 'image/jpeg':
                $img = imagecreatefromjpeg($image['tmp_name']);
                break;

            case 'image/png':
                $img = imagecreatefrompng($image['tmp_name']);
                break;

            default:
                $_SESSION['error'] = 'image_type';
                header('Location: ?');
                die();
                break;
        }

        $thumb = imagecreatetruecolor(60, 60);
        $size = getimagesize($image['tmp_name']);
        imagefilledrectangle($thumb, 0, 0, 60, 60, 0xFFFFFF);
        imagecopyresampled($thumb, $img, 0, 0, 0, 0, 60, 60, $size[0], $size[1]);

        $name = explode('.', $image['name']);
        $name = uniqid().'.'.end($name);
        $address = ROOT.DS.'uploads'.DS.$name;

        imagejpeg($thumb, $address);

        // set in object
        $this->picture = $name;
        $_SESSION['game']['picture'] = $name;
    }
}