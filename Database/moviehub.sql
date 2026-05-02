-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 14, 2025 at 06:02 PM
-- Server version: 8.0.41
-- PHP Version: 8.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `moviehub`
--

-- --------------------------------------------------------

--
-- Table structure for table `actor`
--

CREATE TABLE `actor` (
  `actor_id` int NOT NULL,
  `actor_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `actor`
--

INSERT INTO `actor` (`actor_id`, `actor_name`) VALUES
(62, 'Abhishek Bachchan'),
(63, 'Harleen Sethi'),
(64, 'Prabhu-deva'),
(65, 'shhid kapoor'),
(66, 'Pooja Hegde'),
(67, 'Joju George'),
(68, 'david corenwet'),
(69, 'Sachira Wijesinghe'),
(71, 'Mason Thames'),
(72, 'Saif Ali Khan'),
(73, 'Arjun Kapoor'),
(74, 'Jacqueline Fernandez'),
(75, 'Dulquer Salmaan'),
(76, 'Nithya Menen'),
(77, 'Aju Varghese'),
(78, 'Vineeth'),
(79, 'Ryan Gosling'),
(80, 'Rachel McAdams'),
(81, 'James Marsden'),
(82, 'Paul Johansson'),
(83, 'Vera Farmiga'),
(84, 'Patrick Wilson'),
(85, 'Lili Taylor'),
(86, 'Shanley Caswell'),
(87, 'Jayalath Manoratne'),
(88, 'Umali Thilakaratne'),
(89, 'Thumindu Dodantenna'),
(90, 'Pooja Hegde'),
(91, 'Pavail Gulati'),
(92, 'Suriya'),
(93, 'Suriya'),
(94, 'Jayaram'),
(95, 'Prem Kumar'),
(96, 'Anthony Carrigan'),
(97, 'Isabela Merced'),
(98, 'Wendell Pierce'),
(99, 'Nico Parker'),
(100, 'Peter Serafinowicz'),
(101, 'Bronwyn James');

-- --------------------------------------------------------

--
-- Table structure for table `actormovielink`
--

CREATE TABLE `actormovielink` (
  `link_id` int NOT NULL,
  `movie_id` int DEFAULT NULL,
  `actor_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `actormovielink`
--

INSERT INTO `actormovielink` (`link_id`, `movie_id`, `actor_id`) VALUES
(51, 29, 62),
(52, 29, 63),
(53, 29, 64),
(54, 30, 65),
(55, 30, 66),
(56, 31, 67),
(57, 32, 68),
(58, 33, 69),
(60, 34, 71),
(61, 35, 72),
(62, 35, 73),
(63, 35, 74),
(64, 36, 75),
(65, 36, 76),
(66, 36, 77),
(67, 36, 78),
(68, 37, 79),
(69, 37, 80),
(70, 37, 81),
(71, 37, 82),
(72, 38, 83),
(73, 38, 84),
(74, 38, 85),
(75, 38, 86),
(76, 33, 87),
(77, 33, 88),
(78, 33, 89),
(79, 30, 90),
(80, 30, 91),
(81, 31, 93),
(82, 31, 94),
(83, 31, 95),
(84, 32, 96),
(85, 32, 97),
(86, 32, 98),
(87, 34, 99),
(88, 34, 100),
(89, 34, 101);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int NOT NULL,
  `category_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `category_name`) VALUES
(1, 'Action'),
(2, 'Comedy'),
(3, 'Drama'),
(4, 'Sci-Fi'),
(5, 'Horror'),
(6, 'Fantasy'),
(7, 'Romance'),
(8, 'Thriller'),
(9, 'Adventure'),
(10, 'Animation'),
(11, 'Family');

-- --------------------------------------------------------

--
-- Table structure for table `movie`
--

CREATE TABLE `movie` (
  `movie_id` int NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `release_date` date DEFAULT NULL,
  `summary` text COLLATE utf8mb4_general_ci,
  `director` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `runtime_minutes` int DEFAULT NULL,
  `trailer_url` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `language` varchar(100) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movie`
--

INSERT INTO `movie` (`movie_id`, `title`, `release_date`, `summary`, `director`, `runtime_minutes`, `trailer_url`, `category_id`, `language`) VALUES
(29, 'Be Happy', '2025-03-14', 'The journey of a single father and his talented daughter who aspire to perform on the country\'s biggest dance reality show.', 'Remo D\'Souza', 130, 'https://youtu.be/neApkeqVj4w?si=obqYxCUwjio2UYke', 11, 'Hindi'),
(30, 'Deva', '2024-12-31', 'A police officer investigates the murder of his close friend. However, he suffers a traumatic accident that wipes away his memory, jeopardising the investigation.', 'Rosshan Andrrews', 130, 'https://www.youtube.com/watch?v=3x77q40hATw', 1, 'Hindi'),
(31, 'Retro', '2025-05-01', 'A gangster tries to avoid violence and lead a peaceful life after vowing to his wife.\r\n', 'Karthik Subbaraj', 168, 'https://www.youtube.com/watch?v=ZnH_2I0WoFQ', 1, 'Tamil'),
(32, 'Superman ', '2025-07-11', 'A reboot of the Superman franchise—Clark Kent (David Corenswet) halts a war, but faces backlash and must regain public trust. With support from Lois Lane and fellow heroes, he uncovers Lex Luthor’s manipulations and navigates moral and societal complexities  .', 'James Gunn', 129, 'https://www.youtube.com/watch?v=Ox8ZLF6cGM0', 1, 'English'),
(33, 'A-Level', '2017-02-07', 'After getting through the O/L Examination with outstanding results, Anuththara with his friends eagerly look forward to experience their final years in school as seniors in the A/L class.', ' Rohan Perera', 140, 'https://www.youtube.com/watch?v=UK27_yg9Ry8', 11, 'Sinhala'),
(34, ' How to Train Your Dragon', '2025-06-13', ' On the rugged isle of Berk, where Vikings and dragons have long been enemies, inventive teen Hiccup befriends a rare Night Fury dragon named Toothless. Their bond challenges Viking traditions and the very foundations of Viking society', 'Dean DeBlois ', 125, 'https://youtu.be/22w7z_lT6YM?si=zNLHxxk8z8t_xHnh', 9, 'English'),
(35, 'Bhoot Police', '2021-09-10', 'Two brothers, Vibhooti and Chiraunji, have fought for their share of ghosts. A new case forces them to rethink their own abilities and beliefs.', 'Pawan Kripalani', 129, 'https://www.youtube.com/embed/oBpG-qSd9lM', 2, 'Hindi'),
(36, '100 Days of Love', '2015-02-01', 'Despite their strained history as children, a columnist falls in love with his schoolmate when they meet after years. Just as he decides to win her heart, he learns that she is engaged to another man.', 'Januse Mohammed Majeed', 155, 'https://www.youtube.com/embed/q23px5zEnXk', 7, 'Hindi'),
(37, 'The Notebook', '2004-02-06', 'When Evelyn Salt (Angelina Jolie) became a CIA officer, she swore an oath to duty, honor and country. But, when a defector accuses her of being a Russian spy, Salt\'s oath is put to the test. Now a fugitive, Salt must use every skill gained from years of training and experience to evade capture, but the more she tries to prove her innocence, the more guilty she seems.', 'Nick Cassavetes', 123, 'https://www.youtube.com/embed/BjJcYdEOI0k', 7, 'English'),
(38, 'The Conjuring', '2013-01-07', 'In 1970, paranormal investigators and demonologist...', 'James Wan', 112, 'https://www.youtube.com/embed/h9Q4zZS2v1k', 5, 'English');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `subscribed` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `subscribed`) VALUES
(1, 'Admin', 'admin@filmmania.com', '$2y$10$TwmfOwewjGsWp7zXgYFXZutmcBPU2BeJQbpHiSHfaI61f9LgtZ50e', 1),
(16, 'example', 'example@gmail.com', '$2y$10$1ztKajAtzNbLxnhT6FNY3uHBb1rsehJeGEoCEE28UiZcJmM.5/fFG', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `actor`
--
ALTER TABLE `actor`
  ADD PRIMARY KEY (`actor_id`);

--
-- Indexes for table `actormovielink`
--
ALTER TABLE `actormovielink`
  ADD PRIMARY KEY (`link_id`),
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `actor_id` (`actor_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `movie`
--
ALTER TABLE `movie`
  ADD PRIMARY KEY (`movie_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `actor`
--
ALTER TABLE `actor`
  MODIFY `actor_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `actormovielink`
--
ALTER TABLE `actormovielink`
  MODIFY `link_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `movie`
--
ALTER TABLE `movie`
  MODIFY `movie_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `actormovielink`
--
ALTER TABLE `actormovielink`
  ADD CONSTRAINT `actormovielink_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`movie_id`),
  ADD CONSTRAINT `actormovielink_ibfk_2` FOREIGN KEY (`actor_id`) REFERENCES `actor` (`actor_id`);

--
-- Constraints for table `movie`
--
ALTER TABLE `movie`
  ADD CONSTRAINT `movie_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
