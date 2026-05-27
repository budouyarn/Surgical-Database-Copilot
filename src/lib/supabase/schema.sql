-- Surgeons
create table if not exists surgeons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text not null,
  hospital text not null,
  email text,
  phone text,
  created_at timestamptz default now()
);

-- Procedures
create table if not exists procedures (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text not null,
  description text,
  created_at timestamptz default now()
);

-- Preference cards (surgeon + procedure combination)
create table if not exists preference_cards (
  id uuid primary key default gen_random_uuid(),
  surgeon_id uuid references surgeons(id) on delete cascade,
  procedure_id uuid references procedures(id) on delete cascade,
  instruments text[] default '{}',
  sutures text[] default '{}',
  positioning text default '',
  draping text default '',
  special_equipment text[] default '{}',
  steps text[] default '{}',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(surgeon_id, procedure_id)
);

-- Operation cases
create table if not exists operation_cases (
  id uuid primary key default gen_random_uuid(),
  surgeon_id uuid references surgeons(id) on delete set null,
  procedure_id uuid references procedures(id) on delete set null,
  patient_mrn text,
  date timestamptz not null,
  duration_minutes integer,
  status text check (status in ('scheduled','in_progress','completed','cancelled')) default 'scheduled',
  notes text default '',
  created_at timestamptz default now()
);

-- Enable RLS
alter table surgeons enable row level security;
alter table procedures enable row level security;
alter table preference_cards enable row level security;
alter table operation_cases enable row level security;

-- Open policies for authenticated users (tighten per your org needs)
create policy "authenticated_read_surgeons" on surgeons for select using (true);
create policy "authenticated_write_surgeons" on surgeons for all using (true);

create policy "authenticated_read_procedures" on procedures for select using (true);
create policy "authenticated_write_procedures" on procedures for all using (true);

create policy "authenticated_read_preference_cards" on preference_cards for select using (true);
create policy "authenticated_write_preference_cards" on preference_cards for all using (true);

create policy "authenticated_read_cases" on operation_cases for select using (true);
create policy "authenticated_write_cases" on operation_cases for all using (true);

-- Updated_at trigger for preference_cards
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger preference_cards_updated_at
  before update on preference_cards
  for each row execute function update_updated_at();
