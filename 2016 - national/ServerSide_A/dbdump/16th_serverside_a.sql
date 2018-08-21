-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Sep 02, 2016 at 05:50 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `16th_serverside_a`
--

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

CREATE TABLE IF NOT EXISTS `scores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nick_name` varchar(255) COLLATE utf8_bin NOT NULL,
  `picture` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `p_score` tinyint(4) NOT NULL,
  `c_score` tinyint(4) NOT NULL,
  `set_date` date NOT NULL,
  `time_seconds` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=15 ;

--
-- Dumping data for table `scores`
--

INSERT INTO `scores` (`id`, `nick_name`, `picture`, `p_score`, `c_score`, `set_date`, `time_seconds`) VALUES
(13, 'Mahdi Motamedi', '57c99ef9a25ce.jpg', 3, 2, '2016-09-02', 2),
(14, 'i am me', '', 3, 2, '2016-09-02', 2);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
