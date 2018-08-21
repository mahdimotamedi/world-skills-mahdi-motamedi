-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 07, 2016 at 01:02 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `16th_serverside_b`
--

-- --------------------------------------------------------

--
-- Table structure for table `book`
--

CREATE TABLE IF NOT EXISTS `book` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `guest_name` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `country_id` int(11) NOT NULL,
  `guest_id` int(11) NOT NULL,
  `state` tinyint(4) NOT NULL DEFAULT '0',
  `day_id` int(11) NOT NULL,
  `dining_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `country_id` (`country_id`),
  KEY `guest_id` (`guest_id`),
  KEY `day_id` (`day_id`),
  KEY `dining_id` (`dining_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=16 ;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`id`, `guest_name`, `country_id`, `guest_id`, `state`, `day_id`, `dining_id`) VALUES
(1, 'asghar', 6, 10, 3, 1, 4),
(2, 'asghar', 6, 10, 2, 3, 4),
(3, 'asghar', 6, 10, 1, 4, 4),
(4, 'asghar', 6, 10, 0, 1, 7),
(5, 'asghar', 6, 10, 0, 4, 7),
(6, 'asghar', 6, 10, 3, 2, 6),
(7, 'asghar', 6, 10, 2, 3, 6),
(8, 'hjhh', 1, 11, 0, 1, 3),
(9, 'ff', 1, 11, 0, 1, 3),
(10, 'sss', 7, 11, 1, 1, 7),
(11, 'ddd', 5, 11, 1, 1, 7),
(12, 'qqq', 2, 11, 1, 1, 7),
(13, 'zz', 1, 11, 1, 1, 7),
(14, 'rrr', 5, 11, 0, 3, 4),
(15, 'tt', 4, 11, 0, 3, 4);

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE IF NOT EXISTS `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_bin NOT NULL,
  `short_name` varchar(10) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=9 ;

--
-- Dumping data for table `country`
--

INSERT INTO `country` (`id`, `name`, `short_name`) VALUES
(1, 'Australia', 'AU'),
(2, 'Brasil', 'BR'),
(3, 'Canada', 'CA'),
(4, 'Switzerland', 'CH'),
(5, 'China', 'CN'),
(6, 'Germany', 'DE'),
(7, 'France', 'FR'),
(8, 'India', 'IN');

-- --------------------------------------------------------

--
-- Table structure for table `days`
--

CREATE TABLE IF NOT EXISTS `days` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_bin NOT NULL,
  `holding_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=5 ;

--
-- Dumping data for table `days`
--

INSERT INTO `days` (`id`, `name`, `holding_date`) VALUES
(1, 'C1', '2016-09-07'),
(2, 'C2', '2016-09-08'),
(3, 'C3', '2016-09-09'),
(4, 'C4', '2016-09-10');

-- --------------------------------------------------------

--
-- Table structure for table `dining`
--

CREATE TABLE IF NOT EXISTS `dining` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_bin NOT NULL,
  `hours` varchar(100) COLLATE utf8_bin NOT NULL,
  `capacity_for_rival` smallint(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=8 ;

--
-- Dumping data for table `dining`
--

INSERT INTO `dining` (`id`, `name`, `hours`, `capacity_for_rival`) VALUES
(3, 'Casual Dining', '10:50 - 12:30', 4),
(4, 'Casual Dining', '10:50 - 12:30', 2),
(5, 'Bar Service', '13:15 - 14:45', 6),
(6, 'Fine Dining', '13:00 - 15:15', 4),
(7, 'Banquet Dining', '12:45 - 15:00', 6);

-- --------------------------------------------------------

--
-- Table structure for table `guest`
--

CREATE TABLE IF NOT EXISTS `guest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_bin NOT NULL,
  `organization` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_bin NOT NULL,
  `phone` varchar(40) COLLATE utf8_bin DEFAULT NULL,
  `country_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `country_id` (`country_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=12 ;

--
-- Dumping data for table `guest`
--

INSERT INTO `guest` (`id`, `name`, `organization`, `email`, `phone`, `country_id`) VALUES
(7, 'mahdi', 'fs', 'fds@rwe.rr', '324', 3),
(8, 'mahdi', 'fs', 'fds@rwe.rr', '324', 3),
(9, 'mahdi', 'mm', 'info@mahdi.com', '123435', 1),
(10, 'asghar', 'qq', 'info@mahdi.com', '12345', 6),
(11, 'mahdi', 'mmmooo', 'main@ddd.rr', '123456', 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `book`
--
ALTER TABLE `book`
  ADD CONSTRAINT `book_ibfk_1` FOREIGN KEY (`guest_id`) REFERENCES `guest` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `book_ibfk_2` FOREIGN KEY (`day_id`) REFERENCES `days` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `book_ibfk_3` FOREIGN KEY (`dining_id`) REFERENCES `dining` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `country` FOREIGN KEY (`country_id`) REFERENCES `country` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `guest`
--
ALTER TABLE `guest`
  ADD CONSTRAINT `guest_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `country` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
