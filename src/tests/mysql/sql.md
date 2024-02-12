// create table
create table test_table (
    id int NOT NULL primary key,
    name varchar(255) DEFAULT NULL,
    age int DEFAULT NULL,
    address varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

// create procedure

create definer=`testjs`@`%` PROCEDURE `insert_data`()
BEGIN
DECLARE max_id INT DEFAULT 10000000;
DECLARE i INT DEFAULT 1;
WHILE i<= max_id DO
INSERT INTO test_table (id, name, age, address) VALUES (i, CONCAT('Name', i), i%100, CONCAT('Address', i));
SET i = i + 1;
END WHILE;
END