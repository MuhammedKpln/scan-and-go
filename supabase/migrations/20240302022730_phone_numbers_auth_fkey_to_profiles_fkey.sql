alter table "public"."phone_numbers" drop constraint "public_phoneNumbers_userId_fkey";

alter table "public"."phone_numbers" add constraint "phone_numbers_userId_fkey" FOREIGN KEY ("userId") REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."phone_numbers" validate constraint "phone_numbers_userId_fkey";



