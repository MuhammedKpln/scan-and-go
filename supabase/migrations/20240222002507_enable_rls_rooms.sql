alter table "public"."rooms" enable row level security;

create policy "Enable delete for authenticated users only"
on "public"."rooms"
as permissive
for delete
to authenticated
using ((array_position(users, auth.uid()) IS NOT NULL));


create policy "Enable insert for service users only"
on "public"."rooms"
as permissive
for insert
to service_role
with check (true);


create policy "Enable select for authenticated users only"
on "public"."rooms"
as permissive
for select
to authenticated
using ((array_position(users, auth.uid()) IS NOT NULL));


create policy "Enable update for authenticated users only"
on "public"."rooms"
as permissive
for update
to service_role
using (true)
with check (true);




