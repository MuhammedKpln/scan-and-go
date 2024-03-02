ALTER TABLE fcm_tokens ADD COLUMN id_new UUID DEFAULT "gen_random_uuid"();

UPDATE fcm_tokens SET id_new = "gen_random_uuid"();

ALTER TABLE fcm_tokens DROP COLUMN id;

ALTER TABLE fcm_tokens RENAME COLUMN id_new TO id;

ALTER TABLE fcm_tokens ADD PRIMARY KEY (id);
