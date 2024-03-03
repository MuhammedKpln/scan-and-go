ALTER TABLE social_media_accounts ADD COLUMN id_new UUID DEFAULT "gen_random_uuid"();

UPDATE social_media_accounts SET id_new = "gen_random_uuid"();

ALTER TABLE social_media_accounts DROP COLUMN id;

ALTER TABLE social_media_accounts RENAME COLUMN id_new TO id;

ALTER TABLE social_media_accounts ADD PRIMARY KEY (id);
