drop policy "Delete for authenticated user only" on "public"."social_media_accounts";

drop policy "Enable insert only for authenticated user" on "public"."social_media_accounts";

drop policy "Enable update for users based on uid" on "public"."social_media_accounts";

alter table "public"."social_media_accounts" drop constraint "public_social_media_accounts_userId_fkey";

alter table "public"."social_media_accounts" drop column "userId";

alter table "public"."social_media_accounts" alter column "id" drop default;

alter table "public"."social_media_accounts" add constraint "social_media_accounts_id_fkey" FOREIGN KEY (id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."social_media_accounts" validate constraint "social_media_accounts_id_fkey";

create policy "Delete for authenticated user only"
on "public"."social_media_accounts"
as permissive
for delete
to authenticated
using ((auth.uid() = id));


create policy "Enable insert only for authenticated user"
on "public"."social_media_accounts"
as permissive
for insert
to authenticated
with check ((auth.uid() = id));


create policy "Enable update for users based on uid"
on "public"."social_media_accounts"
as permissive
for update
to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));




