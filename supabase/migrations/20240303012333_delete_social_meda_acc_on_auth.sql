create policy "Delete for authenticated user only"
on "public"."social_media_accounts"
as permissive
for delete
to authenticated
using ((auth.uid() = "userId"));