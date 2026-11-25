-- Step 13: Premium subscription (demo payments).
-- Run once in Supabase → SQL Editor, AFTER step-11-12.sql.

-- Subscriptions live in their own table, not in profiles, because profiles are readable
-- by other users. Here, each person can only read their own row, so nobody can see
-- who pays.
create table public.subscriptions (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  plan text not null default 'premium',
  premium_until timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Read own subscription"
  on public.subscriptions for select
  to authenticated
  using (user_id = auth.uid());

-- No insert/update/delete policies: users can't give themselves premium.
-- Only the functions below can write, and in production only a payment-gateway
-- webhook (with a verified signature) would call them.

-- Demo checkout: adds 30 days (on top of any time left)
create function public.activate_demo_premium()
returns timestamptz
language sql security definer set search_path = ''
as $$
  insert into public.subscriptions (user_id, premium_until)
  values (auth.uid(), now() + interval '30 days')
  on conflict (user_id) do update
    set premium_until = greatest(public.subscriptions.premium_until, now()) + interval '30 days',
        updated_at = now()
  returning premium_until;
$$;

-- Cancel: premium ends now (a real app would end it at the close of the billing period)
create function public.cancel_premium()
returns void
language sql security definer set search_path = ''
as $$
  update public.subscriptions
  set premium_until = now(), updated_at = now()
  where user_id = auth.uid();
$$;

revoke execute on function public.activate_demo_premium() from public, anon;
grant execute on function public.activate_demo_premium() to authenticated;
revoke execute on function public.cancel_premium() from public, anon;
grant execute on function public.cancel_premium() to authenticated;
