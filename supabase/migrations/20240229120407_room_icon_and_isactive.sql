alter table "public"."tags" drop constraint "public_tags_userId_fkey";

alter table "public"."tags" add column "icon" character varying;

alter table "public"."tags" add column "isActive" boolean not null default true;

alter table "public"."tags" alter column "isAvailable" set not null;

alter table "public"."tags" add constraint "tags_userId_fkey" FOREIGN KEY ("userId") REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tags" validate constraint "tags_userId_fkey";



