drop policy "Enable insert for authenticated users only" on "public"."phone_numbers";

drop policy "Enable update for users based on userid" on "public"."phone_numbers";

drop policy "Get user phone number if user allowed it" on "public"."phone_numbers";

alter table "public"."phone_numbers" drop constraint "phone_numbers_userId_fkey";

alter table "public"."phone_numbers" drop column "userId";

alter table "public"."phone_numbers" alter column "id" drop default;

alter table "public"."phone_numbers" add constraint "phone_numbers_id_fkey" FOREIGN KEY (id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."phone_numbers" validate constraint "phone_numbers_id_fkey";

create policy "Enable insert for authenticated users only"
on "public"."phone_numbers"
as permissive
for insert
to authenticated
with check ((auth.uid() = id));


create policy "Enable update for users based on userid"
on "public"."phone_numbers"
as permissive
for update
to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));


create policy "Get user phone number if user allowed it"
on "public"."phone_numbers"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = phone_numbers.id) AND (profiles."showPhoneNumber" = true)))));




