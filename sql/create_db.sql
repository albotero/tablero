CREATE DATABASE IF NOT EXISTS tablero;
USE tablero;

CREATE TABLE IF NOT EXISTS users (
  `user` int primary key not null auto_increment,
  `password` text,
  `groups` text,
  `active` boolean
);

CREATE TABLE IF NOT EXISTS board (
  `eventid` int primary key auto_increment,
  `location` text,
  `rips` int,
  `time` timestamp,
  `status` text,
  `detail` text,
  `relative` boolean default false,
  `user` int
);

