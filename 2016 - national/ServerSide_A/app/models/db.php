<?php
class db {

    private $con;

    function __construct()
    {
        $this->con = mysqli_connect('localhost', 'root', '', '16th_serverside_a');
    }

    function query($q)
    {
        $result = mysqli_query($this->con, $q);
        return $result;
    }

    function select($q)
    {
        $result = mysqli_query($this->con, $q);
        $result = mysqli_fetch_all($result, MYSQLI_ASSOC);
        return $result;
    }

    function error()
    {
        return mysqli_error($this->con);
    }
}