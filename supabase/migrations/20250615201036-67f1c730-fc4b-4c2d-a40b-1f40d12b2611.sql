
-- USERS Table (Só crie se você quiser dados extras além do sistema auth)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text,
  profile jsonb,
  created_at timestamp with time zone default now()
);

-- MISSIONS
create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  start_date date,
  end_date date
);

-- CHECK_INS
create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  mission_id uuid not null references public.missions(id) on delete cascade,
  payload jsonb,
  created_at timestamp with time zone default now()
);

-- PROMPT_SPECS
create table if not exists public.prompt_specs (
  id uuid primary key default gen_random_uuid(),
  feature_name text not null,
  specification jsonb,
  created_at timestamp with time zone default now()
);

-- Habilita RLS
alter table public.users enable row level security;
alter table public.missions enable row level security;
alter table public.check_ins enable row level security;
alter table public.prompt_specs enable row level security;

-- Policies para garantir segurança por user_id
create policy "User can manage own" on public.missions
  for all
  using (user_id = auth.uid());

create policy "User can manage own" on public.check_ins
  for all
  using (user_id = auth.uid());

-- (prompt_specs pode ser global, use políticas conforme necessário)
