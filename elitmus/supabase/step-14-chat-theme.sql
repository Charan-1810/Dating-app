-- Step 14: shared chat themes (both people in a match see the same theme).
-- Run once in Supabase → SQL Editor, AFTER step-13-premium.sql.

-- The theme belongs to the match, so it's the same for both people.
-- The check stops anyone saving a made-up theme name.
alter table public.matches
  add column chat_theme text not null default 'blush'
  check (chat_theme in ('blush', 'garden', 'lagoon', 'dusk', 'midnight', 'classic'));

-- Users still can't update matches directly (no update policy).
-- This function is the only way in, and it only works if you're one of the two people.
create function public.set_chat_theme(p_match_id uuid, p_theme text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  update public.matches
  set chat_theme = p_theme
  where id = p_match_id
    and auth.uid() in (user_a, user_b);

  if not found then
    raise exception 'You are not in this chat' using errcode = 'P0001';
  end if;
end;
$$;

revoke execute on function public.set_chat_theme(uuid, text) from public, anon;
grant execute on function public.set_chat_theme(uuid, text) to authenticated;

-- Realtime: send theme changes to the other person live.
-- (Realtime still applies RLS, so only the two people in the match receive them.)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'matches'
  ) then
    alter publication supabase_realtime add table public.matches;
  end if;
end;
$$;
