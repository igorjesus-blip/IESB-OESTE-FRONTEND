-- Run this in MySQL Workbench as an admin (root)
-- Creates database and a dedicated user `chronos` with password `iesb`

CREATE DATABASE IF NOT EXISTS pomodoro_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'chronos'@'localhost' IDENTIFIED BY 'iesb';
GRANT ALL PRIVILEGES ON pomodoro_db.* TO 'chronos'@'localhost';
FLUSH PRIVILEGES;

-- Optional: show databases and users
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User IN ('chronos','root');
