-- phpMyAdmin SQL Dump
-- version 4.8.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 29, 2018 at 05:11 PM
-- Server version: 10.1.31-MariaDB
-- PHP Version: 5.6.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `roadmap_api`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `className` varchar(32) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `detail` text NOT NULL,
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `className`, `start`, `end`, `detail`, `content`) VALUES
(1, 'Critical', '2018-07-01 00:00:00', '2018-07-01 23:59:59', 'teste\n', 'Event1'),
(2, 'Medium', '2018-06-25 00:00:00', '2018-06-29 23:59:59', '\n<b>Anual event:</b> the all-hands event was the first step towards an articulation between Hitachi Vantara and CSI teams. It’s important that we keep doing this kind of events. </p>\n\n<b>Recurrent meetings (monthly, quarterly…):</b> setting a specific time to discuss a particular subject might reinforce the collaboration between the teams. It’s hard to keep this type of initiatives alive, but with effort and interesting activities, we would be able to articulate on many subjects (imagine setting up a meeting, next month, to discuss accessibility, were 2/3 designers, would present their ideas on it and we would discuss them during an hour)</p>\n\n<b>Give visibility about our work:</b> The design system team aims to share the ongoing work to gather as much feedback as possible. Collaboration is extremely valuable for the development of our work and we want to have all the Hitachi teams contributing to it. Medium is one of the platforms we are considering to expose our ideas. </p>\n\n<b>Hitachi Experience Design community:</b> a Hitachi community would allow our teams\' members to interact around the interests that we share. A community is a two-way conversation, where everyone is able to expose ideas and share knowledge. Sure some people just watch or read, but they may also participate and share their ideas. </p>', 'All Hands 2018\n\n'),
(3, 'High', '2018-06-25 00:00:00', '2018-06-25 23:59:59', 'Public Event where users can see the new product launch.', 'Launch Pentaho 8.0.0.2'),
(4, 'Critical', '2018-06-21 00:00:00', '2018-06-23 23:59:59', 'A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications.', 'Design System Meet Up'),
(5, 'Critical', '2018-06-01 00:00:00', '2018-06-24 23:59:59', 'Evaluate current research findings </p>\nDefine next steps for implementation', 'Roadmap Version 1'),
(6, 'Medium', '2018-06-24 00:00:00', '2018-07-07 23:59:59', 'Add info text labels w/ instructions for how to add/edit events </p>\nFix close/delete workflow </p>\nContent panel should be a popup with editable fields </p>\nPriority (color code only) </p>\nMulti-tenancy', 'Roadmap Version 2'),
(7, 'High', '2018-07-01 00:00:00', '2018-07-01 00:00:00', 'this is a detail test', 'this is a content test');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
