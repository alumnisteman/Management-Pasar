#!/bin/bash
docker exec svms-mysql-1 mysql -uroot -proot svms << 'SQL'
SET foreign_key_checks = 0;
ALTER TABLE slots 
  ADD COLUMN IF NOT EXISTS category VARCHAR(20) DEFAULT 'umum' AFTER code,
  MODIFY COLUMN zone_id char(36) NULL,
  MODIFY COLUMN x_position int NULL,
  MODIFY COLUMN y_position int NULL;
SET foreign_key_checks = 1;
DESCRIBE slots;
SQL
