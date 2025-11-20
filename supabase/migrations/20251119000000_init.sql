-- Create patients table
create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  medical_id text unique not null,
  name text not null,
  ward text,
  bed_number text,
  gender text,
  age int,
  admission_date date,
  attending_physician text,
  nursing_level text,
  created_at timestamptz default now()
);

-- Create nursing_records table
create table if not exists nursing_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  content text,
  recorder text,
  recorded_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Enable RLS (Optional for local but good practice)
alter table patients enable row level security;
alter table nursing_records enable row level security;

-- Create policies (Allow all for now for local dev)
create policy "Allow all access to patients" on patients for all using (true);
create policy "Allow all access to nursing_records" on nursing_records for all using (true);
