-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 25, 2016 at 02:47 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `15th_module_e`
--

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE IF NOT EXISTS `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `admin_access` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `title`, `admin_access`) VALUES
(0, 'مدیر کل', 1),
(1, 'کارشناس ارشد2', 0),
(12, 'کارشناس خوشگل', 0);

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE IF NOT EXISTS `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `work_group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `task_to_user` (`user_id`),
  KEY `work_group_id` (`work_group_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`id`, `user_id`, `work_group_id`) VALUES
(1, 8, 3),
(2, 10, 3),
(3, 1, 4),
(4, 10, 3);

-- --------------------------------------------------------

--
-- Table structure for table `time_shift`
--

CREATE TABLE IF NOT EXISTS `time_shift` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `from_time` time NOT NULL,
  `to_time` time NOT NULL,
  `work_group_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `work_group` (`work_group_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=24 ;

--
-- Dumping data for table `time_shift`
--

INSERT INTO `time_shift` (`id`, `date`, `from_time`, `to_time`, `work_group_id`) VALUES
(11, '2016-08-08', '12:00:00', '12:45:00', 3),
(12, '2016-08-10', '12:00:00', '12:45:00', 5),
(13, '2016-08-18', '12:00:00', '12:45:00', 3),
(14, '2016-09-09', '12:00:00', '12:45:00', 4),
(15, '2016-09-10', '18:45:00', '18:45:00', 4),
(16, '2016-09-06', '12:00:00', '12:45:00', 6),
(17, '2016-09-24', '12:00:00', '12:45:00', 6),
(18, '2016-09-22', '12:00:00', '12:45:00', 5),
(19, '2016-09-25', '12:00:00', '12:45:00', 3),
(20, '2016-09-25', '13:00:00', '12:00:00', 3),
(21, '2016-09-25', '17:00:00', '13:00:00', 3),
(22, '2016-09-20', '12:00:00', '17:45:00', 7),
(23, '2016-09-25', '13:00:00', '17:45:00', 4);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `picture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `role_index` (`role_id`) USING BTREE,
  KEY `role_id` (`role_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `fname`, `lname`, `email`, `password`, `role_id`, `picture`) VALUES
(1, 'مدیر کل', NULL, 'manager@worldskills.ir', '1234qwer', 0, NULL),
(8, 'مهدی7', 'معتمدی', 'iii@rwerw.rr', '12345', 12, 'PBrJLFz9smMQGg4SESJ1NnxyDnROOuzJ.jpg'),
(10, 'hgff7', 'efog', 'gffh@rwe.rr', '12345', 1, 'aMYxEQ8UbMh8jFryXs6fGaGwLbRW-vlg.jpg'),
(11, 'uytu', 'wer', 'aa@aa.rr', '12345', 0, NULL),
(12, 'مهدی', 'معتمدی', 'info@factorkon.ir', '12345', 12, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `work_group`
--

CREATE TABLE IF NOT EXISTS `work_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `work_group`
--

INSERT INTO `work_group` (`id`, `title`) VALUES
(3, 'سلام فردا 2'),
(4, 'سلام خاله بزغاله'),
(5, 'چطوری پسر'),
(6, 'سلام عشقم'),
(7, 'سلام چطوری بزغاله');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`work_group_id`) REFERENCES `work_group` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `task_to_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `time_shift`
--
ALTER TABLE `time_shift`
  ADD CONSTRAINT `work_group` FOREIGN KEY (`work_group_id`) REFERENCES `work_group` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `rolerole` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
