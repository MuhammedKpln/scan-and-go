ALTER TABLE phone_numbers ADD COLUMN id_new UUID DEFAULT "gen_random_uuid"();

UPDATE phone_numbers SET id_new = "gen_random_uuid"();

ALTER TABLE phone_numbers DROP COLUMN id;

ALTER TABLE phone_numbers RENAME COLUMN id_new TO id;

ALTER TABLE phone_numbers ADD PRIMARY KEY (id);
