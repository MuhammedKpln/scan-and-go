create policy "Enable delete for users based on user_id"
on "public"."notifications"
as permissive
for delete
to authenticated
using ((auth.uid() = "toUserId"));


create policy "Enable insert for service users only"
on "public"."notifications"
as permissive
for insert
to service_role
with check (true);


create policy "Enable read access for authenticated user only"
on "public"."notifications"
as permissive
for select
to authenticated
using ((auth.uid() = "toUserId"));


CREATE OR REPLACE TRIGGER send_push_notification_on_insert_notification AFTER INSERT ON public.notifications FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://dvjjscevplxuhsmlmpqz.supabase.co/functions/v1/push_notification', 'POST', '{"Content-type":"application/json"}', '{}', '5000');



