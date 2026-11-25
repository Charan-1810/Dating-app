-- Steps 11b, 11c and 12: activity tracking, eLitmus verification, account deletion.
-- Run once in Supabase → SQL Editor.

-- ===== 11b. Activity tracking =====
-- Records "I'm using the app now". Writes at most once every 5 minutes per user,
-- so browsing around doesn't hammer the database with updates.
create function public.touch_last_active()
returns void
language sql security definer set search_path = ''
as $$
  update public.profiles
  set last_active_at = now()
  where id = auth.uid()
    and last_active_at < now() - interval '5 minutes';
$$;

-- ===== 11c. eLitmus verification (opt-in, DPDP) =====
alter table public.profiles add column elitmus_consent boolean not null default false;
grant insert (elitmus_consent) on public.profiles to authenticated;

-- Stand-in for eLitmus's own candidate records. In production this would be an
-- API call to eLitmus, made only for users who gave consent.
create table public.elitmus_candidates (email text primary key);
alter table public.elitmus_candidates enable row level security; -- no policies: unreadable through the API

-- When a profile is created: Verified = consented AND email is a known eLitmus candidate
create function public.set_elitmus_verified()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  new.is_verified := new.elitmus_consent and exists (
    select 1
    from auth.users u
    join public.elitmus_candidates c on lower(c.email) = lower(u.email)
    where u.id = new.id
  );
  return new;
end;
$$;

create trigger on_profile_created_verify
  before insert on public.profiles
  for each row execute function public.set_elitmus_verified();

-- ===== 12. Delete my account (DPDP: deletion removes all data) =====
-- Deleting the auth user cascades to profile, photos rows, prompts, likes, matches, messages, blocks.
create function public.delete_my_account()
returns void
language sql security definer set search_path = ''
as $$
  delete from auth.users where id = auth.uid();
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
revoke execute on function public.touch_last_active() from public, anon;
grant execute on function public.touch_last_active() to authenticated;


-- ============================================================================
-- Personality quiz: retake limit (once every 7 days)
-- The app hides the quiz during the lock, but this trigger is the real rule:
-- even a hand-crafted API request can't overwrite answers within 7 days.
-- ============================================================================

alter table public.profiles add column if not exists personality_taken_at timestamptz;

create or replace function public.guard_personality_retake()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.personality is distinct from old.personality then
    if old.personality is not null
       and old.personality_taken_at is not null
       and old.personality_taken_at > now() - interval '7 days' then
      raise exception 'You can retake the personality quiz once every 7 days.'
        using errcode = 'P0001';
    end if;
    new.personality_taken_at := now();            -- stamp the new attempt
  else
    new.personality_taken_at := old.personality_taken_at;  -- nobody can edit it directly
  end if;
  return new;
end;
$$;

drop trigger if exists before_personality_update on public.profiles;
create trigger before_personality_update
  before update on public.profiles
  for each row execute function public.guard_personality_retake();
