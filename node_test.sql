-- phpMyAdmin SQL Dump
-- version 4.5.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 08, 2017 at 06:55 PM
-- Server version: 5.5.47-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `node_test`
--

-- --------------------------------------------------------

--
-- Table structure for table `address_book`
--

CREATE TABLE `address_book` (
  `sl_number` int(11) NOT NULL,
  `emp_name` varchar(255) DEFAULT NULL,
  `emp_email` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `address_book`
--

INSERT INTO `address_book` (`sl_number`, `emp_name`, `emp_email`, `created_by`) VALUES
(2, 'Pallav mondal', 'pallav@unifiedinfotech.net', 1),
(4, 'Soumyadip Hazra', 'soumyadip@unifiedinfotech.net', 1),
(5, 'SNG', 'sng@unifiedinfotech.net', 1),
(6, 'Bhim Kumar', 'bhim@unifiedinfotech.net', 1),
(7, 'Anuraag Bhaskar', 'anuraag.g@unifiedinfotech.net', 1),
(8, 'Ayan Sil', 'ayan@unifiedinfotech.net', 1),
(10, 'Amit banerjee', 'amit@unifiedinfotech.net', 1),
(11, 'Anirban K', 'anirban.k@unifiedinfotech.net', 1),
(12, 'Ankan Dey', 'ankan@unifiedinfotech.net', 1),
(13, 'Ayan Chakrabarty', 'ayan.c@unifiedinfotech.net', 1),
(14, 'Chanchal', 'chanchal@unifiedinfotech.net', 1),
(15, 'Ramesh Kumar', 'ramesh@unifiedinfotech.net', 1),
(16, 'Ranjita Paul', 'ranjita@unifiedinfotech.net', 1);

-- --------------------------------------------------------

--
-- Table structure for table `emails`
--

CREATE TABLE `emails` (
  `id` int(11) NOT NULL,
  `mail_title` varchar(255) DEFAULT NULL,
  `mail_body` text,
  `schedule_date` date DEFAULT NULL,
  `schedule_time` time DEFAULT NULL,
  `status` enum('A','I','D') NOT NULL DEFAULT 'A',
  `created_by` int(11) NOT NULL,
  `created_by_username` varchar(255) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `emails`
--

INSERT INTO `emails` (`id`, `mail_title`, `mail_body`, `schedule_date`, `schedule_time`, `status`, `created_by`, `created_by_username`, `created_on`) VALUES
(1, 'Thought of the day', 'httttt', '2017-09-04', '04:06:00', 'A', 1, 'soumyadip1', '0000-00-00 00:00:00'),
(2, 'Thought of the day 1', 'hrgesrgdg rdgdrgdrg', '2017-09-05', '08:00:00', 'A', 1, 'soumyadip1', '0000-00-00 00:00:00'),
(3, 'Hello All', 'Hello all,\r\nThis is a test message', '2017-09-06', '08:50:00', 'A', 1, 'soumyadip1', '0000-00-00 00:00:00'),
(4, 'Happy Tuesday', 'This is a simple content. this is **bold** text.', '2017-09-05', '09:00:00', 'A', 1, 'soumyadip1', '0000-00-00 00:00:00'),
(5, 'Thought of the Day!', 'Here are some highlights of this text editor\nThis is a simple content. this is **bold** text. \n*You can write a italic text too*\n# Headers are here\n> Well this is a quote indeed\nHow about options ?\n1. Option 1\n2. Option 2\n3. Option 3\n\nLooking for bullet points?\n* option 1\n* option 2\n* option 3\nInsert a image too\n![Image By Google](http://searchengineland.com/figz/wp-content/seloads/2015/12/google-amp-speed-rocket-launch2-ss-1920.jpg)', '0000-00-00', '00:00:00', 'A', 1, 'soumyadip1', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `uploads`
--

CREATE TABLE `uploads` (
  `file_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `size` int(11) DEFAULT NULL,
  `uploaded_path` varchar(255) NOT NULL,
  `encoding` varchar(255) DEFAULT NULL,
  `mimetype` varchar(255) DEFAULT NULL,
  `uploaded_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('A','I','D') NOT NULL DEFAULT 'A'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `uploads`
--

INSERT INTO `uploads` (`file_id`, `file_name`, `size`, `uploaded_path`, `encoding`, `mimetype`, `uploaded_on`, `status`) VALUES
(1, 'IMG_20170608_201940.JPG', 344398, 'imgUploader_1504851745131_IMG_20170608_201940.JPG', '7bit', 'image/jpeg', '2017-09-08 06:22:25', 'A'),
(2, 'IMG_20170620_104803.JPG', 281687, 'imgUploader_1504851745167_IMG_20170620_104803.JPG', '7bit', 'image/jpeg', '2017-09-08 06:22:25', 'A'),
(3, 'IMG_20170608_113729.png', 6243065, 'imgUploader_1504854336611_IMG_20170608_113729.png', '7bit', 'image/png', '2017-09-08 07:05:36', 'A'),
(4, 'IMG_20170608_103304.jpg', 14342491, 'imgUploader_1504855804647_IMG_20170608_103304.jpg', '7bit', 'image/jpeg', '2017-09-08 07:30:05', 'A');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `full_name`, `age`) VALUES
(1, 'soumyadip1', '12345', 'Soumyadip Hazra 1', 20),
(3, 'soumyadip2', '12345', 'Soumyadip ', 22);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address_book`
--
ALTER TABLE `address_book`
  ADD PRIMARY KEY (`sl_number`);

--
-- Indexes for table `emails`
--
ALTER TABLE `emails`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `uploads`
--
ALTER TABLE `uploads`
  ADD PRIMARY KEY (`file_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address_book`
--
ALTER TABLE `address_book`
  MODIFY `sl_number` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `emails`
--
ALTER TABLE `emails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `uploads`
--
ALTER TABLE `uploads`
  MODIFY `file_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
