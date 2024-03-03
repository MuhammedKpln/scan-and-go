ALTER TABLE notes ADD COLUMN id_new UUID DEFAULT "gen_random_uuid"();

UPDATE notes SET id_new = "gen_random_uuid"();

ALTER TABLE notes DROP COLUMN id;

ALTER TABLE notes RENAME COLUMN id_new TO id;

ALTER TABLE notes ADD PRIMARY KEY (id);
