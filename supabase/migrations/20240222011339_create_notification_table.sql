create table "public"."notifications" (
    "id" uuid not null default gen_random_uuid(),
    "fromUserId" uuid not null,
    "toUserId" uuid not null,
    "type" bigint not null default '0'::bigint,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."notifications" enable row level security;

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."notifications" add constraint "notifications_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_fromUserId_fkey";

alter table "public"."notifications" add constraint "notifications_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_toUserId_fkey";

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";



