alter table public.gift_results
add column if not exists user_id uuid references auth.users(id) on delete cascade,
add column if not exists occasion text,
add column if not exists budget text,
add column if not exists age text,
add column if not exists gender text,
add column if not exists emotional_tone text,
add column if not exists primary_idea text;

alter table public.gift_results enable row level security;

drop policy if exists "Users can read own gift results" on public.gift_results;
drop policy if exists "Users can insert own gift results" on public.gift_results;
drop policy if exists "Users can update own gift results" on public.gift_results;
drop policy if exists "Users can delete own gift results" on public.gift_results;

create policy "Users can read own gift results"
on public.gift_results
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own gift results"
on public.gift_results
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own gift results"
on public.gift_results
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own gift results"
on public.gift_results
for delete
to authenticated
using (auth.uid() = user_id);

create index if not exists gift_results_user_created_idx
on public.gift_results (user_id, created_at desc);
