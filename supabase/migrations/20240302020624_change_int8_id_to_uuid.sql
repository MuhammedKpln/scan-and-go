alter table "public"."fcm_tokens" drop constraint "public_fcm_tokens_userId_fkey";

alter table "public"."notes" drop constraint "public_notes_tagId_fkey";

alter table "public"."notes" drop constraint "public_notes_userId_fkey";

alter table "public"."phone_numbers" drop constraint "public_phoneNumbers_userId_fkey";

alter table "public"."phone_numbers" drop constraint "public_phone_numbers_userId_fkey";

alter table "public"."social_media_accounts" drop constraint "public_social_media_accounts_userId_fkey";

alter table "public"."phone_numbers" drop constraint "phoneNumbers_pkey";

drop index if exists "public"."phoneNumbers_pkey";

alter table "public"."fcm_tokens" alter column "id" set default gen_random_uuid();

alter table "public"."fcm_tokens" alter column "id" drop identity;

alter table "public"."fcm_tokens" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."notes" alter column "id" set default gen_random_uuid();

alter table "public"."notes" alter column "id" drop identity;

alter table "public"."notes" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."phone_numbers" alter column "id" set default gen_random_uuid();

alter table "public"."phone_numbers" alter column "id" drop identity;

alter table "public"."phone_numbers" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."social_media_accounts" alter column "id" set default gen_random_uuid();

alter table "public"."social_media_accounts" alter column "id" drop identity;

alter table "public"."social_media_accounts" alter column "id" set data type uuid using "id"::uuid;

CREATE UNIQUE INDEX phone_numbers_pkey ON public.phone_numbers USING btree (id);

alter table "public"."phone_numbers" add constraint "phone_numbers_pkey" PRIMARY KEY using index "phone_numbers_pkey";

alter table "public"."fcm_tokens" add constraint "fcm_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."fcm_tokens" validate constraint "fcm_tokens_userId_fkey";

alter table "public"."notes" add constraint "notes_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES tags(id) not valid;

alter table "public"."notes" validate constraint "notes_tagId_fkey";

alter table "public"."notes" add constraint "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES profiles(id) not valid;

alter table "public"."notes" validate constraint "notes_userId_fkey";

alter table "public"."phone_numbers" add constraint "phone_numbers_userId_fkey" FOREIGN KEY ("userId") REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."phone_numbers" validate constraint "phone_numbers_userId_fkey";

alter table "public"."social_media_accounts" add constraint "social_media_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."social_media_accounts" validate constraint "social_media_accounts_userId_fkey";

create policy "Enable delete for users based on user_id"
on "public"."social_media_accounts"
as permissive
for delete
to authenticated
using ((auth.uid() = "userId"));




