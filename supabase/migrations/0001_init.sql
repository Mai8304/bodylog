-- BodyLog · Supabase 初始化迁移（MVP）
-- 说明：创建枚举、表结构、索引与 RLS 策略；包含最小 test_catalog 预置项。

-- 扩展
create extension if not exists pgcrypto;

-- 枚举类型
do $$ begin
  create type report_status as enum (
    'uploaded','queued_extraction','extracting',
    'queued_analysis','analyzing','completed',
    'extraction_failed','analysis_failed'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type metric_category as enum (
    'blood_glucose','blood_lipids','blood_pressure',
    'cbc','liver','renal','urine','general'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type value_flag as enum ('low','normal','high','unknown');
exception when duplicate_object then null; end $$;

-- 表：reports（报告批次）
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  collected_at timestamptz not null default now(),
  locale text default 'zh' check (locale in ('zh','en','ja')),
  status report_status not null default 'uploaded',
  confidence numeric(4,3),
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reports_user_time_idx on public.reports(user_id, collected_at desc);
create index if not exists reports_status_idx on public.reports(status);

-- 表：report_files（报告文件）
create table if not exists public.report_files (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  bucket text not null default 'reports',
  path text not null,
  mime text not null,
  size bigint,
  pages int,
  hash text,
  created_at timestamptz not null default now(),
  unique(bucket, path)
);

create index if not exists report_files_report_idx on public.report_files(report_id);

-- 表：reports_raw_json（原始结构快照）
create table if not exists public.reports_raw_json (
  report_id uuid primary key references public.reports(id) on delete cascade,
  json jsonb not null,
  created_at timestamptz not null default now()
);

-- 表：test_catalog（指标字典）
create table if not exists public.test_catalog (
  canonical_key text primary key,
  category metric_category not null,
  canonical_unit text not null,
  i18n_label_zh text not null,
  i18n_label_en text not null,
  i18n_label_ja text not null,
  synonyms_zh text[] default '{}',
  synonyms_en text[] default '{}',
  synonyms_ja text[] default '{}',
  loinc_code text,
  created_at timestamptz default now()
);

-- 表：parsed_items（标准化指标明细）
create table if not exists public.parsed_items (
  id bigserial primary key,
  report_id uuid not null references public.reports(id) on delete cascade,
  canonical_key text not null,
  category metric_category not null,
  display_name text,
  original_names text[] default '{}',
  value numeric,
  unit text not null,
  ref_low numeric,
  ref_high numeric,
  ref_unit text,
  flag value_flag not null default 'unknown',
  confidence numeric(4,3),
  original_value_text text,
  original_unit text,
  original_ref_text text,
  page_ref text,
  variant text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists parsed_items_report_idx on public.parsed_items(report_id);
create index if not exists parsed_items_key_idx on public.parsed_items(canonical_key);
create index if not exists parsed_items_key_report_idx on public.parsed_items(canonical_key, report_id);
create unique index if not exists parsed_items_unique_in_report
  on public.parsed_items(report_id, canonical_key, coalesce(variant, ''));

-- 表：ai_summaries（AI 分析）
create table if not exists public.ai_summaries (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  summary text,
  risks jsonb,
  recommendations jsonb,
  model text,
  version text,
  created_at timestamptz not null default now(),
  unique(report_id)
);

-- 可选：profiles（用户偏好）
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  locale text default 'zh',
  unit_system text default 'metric',
  timezone text default 'UTC',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS 开启
alter table public.reports enable row level security;
alter table public.report_files enable row level security;
alter table public.reports_raw_json enable row level security;
alter table public.parsed_items enable row level security;
alter table public.ai_summaries enable row level security;
alter table public.profiles enable row level security;

-- RLS 策略：仅本人可访问（通过 reports.user_id 继承）
do $$ begin
  create policy reports_select_own on public.reports for select using (user_id = auth.uid());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy reports_insert_own on public.reports for insert with check (user_id = auth.uid());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy reports_update_own on public.reports for update using (user_id = auth.uid());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy reports_delete_own on public.reports for delete using (user_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy parsed_items_select_own on public.parsed_items for select
  using (exists (
    select 1 from public.reports r where r.id = parsed_items.report_id and r.user_id = auth.uid()
  ));
exception when duplicate_object then null; end $$;
do $$ begin
  create policy parsed_items_modify_own on public.parsed_items for all
  using (exists (
    select 1 from public.reports r where r.id = parsed_items.report_id and r.user_id = auth.uid()
  )) with check (exists (
    select 1 from public.reports r where r.id = parsed_items.report_id and r.user_id = auth.uid()
  ));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy reports_raw_json_select_own on public.reports_raw_json for select
  using (exists (
    select 1 from public.reports r where r.id = reports_raw_json.report_id and r.user_id = auth.uid()
  ));
exception when duplicate_object then null; end $$;
do $$ begin
  create policy reports_raw_json_modify_own on public.reports_raw_json for all
  using (exists (
    select 1 from public.reports r where r.id = reports_raw_json.report_id and r.user_id = auth.uid()
  )) with check (exists (
    select 1 from public.reports r where r.id = reports_raw_json.report_id and r.user_id = auth.uid()
  ));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy ai_summaries_select_own on public.ai_summaries for select
  using (exists (
    select 1 from public.reports r where r.id = ai_summaries.report_id and r.user_id = auth.uid()
  ));
exception when duplicate_object then null; end $$;
do $$ begin
  create policy ai_summaries_modify_own on public.ai_summaries for all
  using (exists (
    select 1 from public.reports r where r.id = ai_summaries.report_id and r.user_id = auth.uid()
  )) with check (exists (
    select 1 from public.reports r where r.id = ai_summaries.report_id and r.user_id = auth.uid()
  ));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy profiles_select_own on public.profiles for select using (user_id = auth.uid());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy profiles_upsert_own on public.profiles for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
exception when duplicate_object then null; end $$;

-- 预置字典：仅最小趋势项（如已存在则忽略）
insert into public.test_catalog as t (
  canonical_key, category, canonical_unit, i18n_label_zh, i18n_label_en, i18n_label_ja,
  synonyms_zh, synonyms_en, synonyms_ja, loinc_code
)
values
  ('blood_glucose.fpg','blood_glucose','mmol/L','空腹血糖','Fasting Plasma Glucose','空腹時血糖',
    array['血糖','GLU','FPG'], array['GLU','FPG'], array['血糖','FPG'], null),
  ('blood_lipids.tc','blood_lipids','mmol/L','总胆固醇','Total Cholesterol','総コレステロール',
    array['TC','总胆'], array['TC'], array['TC'], null),
  ('blood_lipids.tg','blood_lipids','mmol/L','甘油三酯','Triglycerides','中性脂肪',
    array['TG','三酯'], array['TG'], array['TG'], null),
  ('blood_lipids.ldl_c','blood_lipids','mmol/L','低密度脂蛋白胆固醇','LDL Cholesterol','LDLコレステロール',
    array['LDL','LDL-C'], array['LDL','LDL-C'], array['LDL','LDL-C'], null),
  ('blood_lipids.hdl_c','blood_lipids','mmol/L','高密度脂蛋白胆固醇','HDL Cholesterol','HDLコレステロール',
    array['HDL','HDL-C'], array['HDL','HDL-C'], array['HDL','HDL-C'], null),
  ('blood_pressure.systolic','blood_pressure','mmHg','收缩压','Systolic Blood Pressure','収縮期血圧',
    array['收缩压','高压','SBP'], array['SBP','Systolic'], array['SBP'], null),
  ('blood_pressure.diastolic','blood_pressure','mmHg','舒张压','Diastolic Blood Pressure','拡張期血圧',
    array['舒张压','低压','DBP'], array['DBP','Diastolic'], array['DBP'], null)
on conflict (canonical_key) do nothing;

-- 完成
