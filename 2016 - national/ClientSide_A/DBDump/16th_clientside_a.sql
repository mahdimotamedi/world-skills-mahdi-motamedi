-- phpMyAdmin SQL Dump
-- version 5.0.0-dev
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 21, 2018 at 08:25 AM
-- Server version: 10.1.32-MariaDB
-- PHP Version: 7.2.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `16th_clientside_a`
--

-- --------------------------------------------------------

--
-- Table structure for table `difficult`
--

CREATE TABLE `difficult` (
  `id` int(11) NOT NULL,
  `name` varchar(155) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `difficult`
--

INSERT INTO `difficult` (`id`, `name`) VALUES
(1, 'EASY'),
(2, 'MEDIUM'),
(3, 'HARD');

-- --------------------------------------------------------

--
-- Table structure for table `ranking`
--

CREATE TABLE `ranking` (
  `id` int(11) NOT NULL,
  `name` varchar(155) NOT NULL,
  `difficult_id` int(11) NOT NULL,
  `time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ranking`
--

INSERT INTO `ranking` (`id`, `name`, `difficult_id`, `time`) VALUES
(1, 'mahdi', 1, '00:00:10'),
(2, 'mahdi', 1, '00:00:10'),
(3, 'mahdi', 1, '00:00:09'),
(4, 'mahdi', 2, '00:00:30'),
(5, 'mahdi', 2, '00:00:28'),
(6, 'mahdi', 1, '00:00:08'),
(7, 'mahdi', 1, '00:00:08'),
(8, 'mahdi motamedi', 1, '00:00:15'),
(9, 'mahdi motamedi', 1, '00:00:08'),
(10, 'mahdi motamedi', 2, '00:01:00'),
(11, 'mahdi motamedi', 1, '00:00:17'),
(12, 'mahdi motamedi', 1, '00:00:12'),
(13, 'mahdi motamedi', 1, '00:00:07'),
(14, 'kk gg jj qq aa ss', 2, '00:00:35'),
(15, 'Mehdi Mot', 1, '00:00:13'),
(16, 'Mehdi Mot', 1, '00:00:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `difficult`
--
ALTER TABLE `difficult`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ranking`
--
ALTER TABLE `ranking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `difficult_id` (`difficult_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `difficult`
--
ALTER TABLE `difficult`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ranking`
--
ALTER TABLE `ranking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ranking`
--
ALTER TABLE `ranking`
  ADD CONSTRAINT `ranking_ibfk_1` FOREIGN KEY (`difficult_id`) REFERENCES `difficult` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
