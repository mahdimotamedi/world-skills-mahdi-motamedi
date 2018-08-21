<?php
class db {
    private $con;

    function __construct()
    {
        $this->con = mysqli_connect("localhost", 'root', '', '15th_module_f');
    }

    function selectQuery($query)
    {
        $result = mysqli_query($this->con, $query);
        return mysqli_fetch_all($result, MYSQLI_ASSOC);
    }

    function query($query)
    {
        $result = mysqli_query($this->con, $query);
        return $result;
    }

    function error()
    {
        return mysqli_error($this->con);
    }
}