create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  status text not null default 'Active' check (status in ('Active', 'On hold', 'Completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.requirements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  description text not null default '',
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High', 'Critical')),
  status text not null default 'Draft' check (status in ('Draft', 'Approved', 'In Progress', 'Done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.test_cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  requirement_id uuid references public.requirements(id) on delete set null,
  title text not null,
  description text not null default '',
  expected_result text not null default '',
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High', 'Critical')),
  status text not null default 'Open' check (status in ('Open', 'In Progress', 'Passed', 'Failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bugs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  test_case_id uuid references public.test_cases(id) on delete set null,
  title text not null,
  description text not null default '',
  severity text not null default 'Medium' check (severity in ('Low', 'Medium', 'High', 'Critical')),
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High', 'Critical')),
  status text not null default 'Open' check (status in ('Open', 'In Progress', 'Resolved', 'Closed')),
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bugs add column if not exists attachments jsonb not null default '[]'::jsonb;

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  type text not null check (type in ('BRD', 'SRS')),
  content text not null,
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bug-attachments',
  'bug-attachments',
  false,
  20971520,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/tiff',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    'video/mpeg'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users upload bug attachments" on storage.objects;
create policy "Users upload bug attachments"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'bug-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users read bug attachments" on storage.objects;
create policy "Users read bug attachments"
on storage.objects for select to authenticated
using (
  bucket_id = 'bug-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users delete bug attachments" on storage.objects;
create policy "Users delete bug attachments"
on storage.objects for delete to authenticated
using (
  bucket_id = 'bug-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create index if not exists requirements_user_id_idx on public.requirements(user_id);
create index if not exists test_cases_user_id_idx on public.test_cases(user_id);
create index if not exists bugs_user_id_idx on public.bugs(user_id);
create index if not exists documents_user_id_idx on public.documents(user_id);

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.projects, public.requirements, public.test_cases, public.bugs, public.documents to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects
for each row execute function public.set_updated_at();
drop trigger if exists requirements_updated_at on public.requirements;
create trigger requirements_updated_at before update on public.requirements
for each row execute function public.set_updated_at();
drop trigger if exists test_cases_updated_at on public.test_cases;
create trigger test_cases_updated_at before update on public.test_cases
for each row execute function public.set_updated_at();
drop trigger if exists bugs_updated_at on public.bugs;
create trigger bugs_updated_at before update on public.bugs
for each row execute function public.set_updated_at();

do $$
declare
  table_name text;
begin
  foreach table_name in array array['projects', 'requirements', 'test_cases', 'bugs', 'documents']
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists "Users manage their own %s" on public.%I', table_name, table_name);
    execute format(
      'create policy "Users manage their own %s" on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      table_name, table_name
    );
  end loop;
end $$;
