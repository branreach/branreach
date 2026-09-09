-- Branreach 전체 스키마 (SQL Editor 최초 1회 적용용)
-- 이 파일은 supabase/migrations/ 의 4개 파일을 순서대로 합친 것입니다.
-- Supabase Dashboard > SQL Editor 에 전체 붙여넣고 Run 하세요.


-- ============================================================
-- supabase/migrations/20260910120001_schema.sql
-- ============================================================

-- Branreach 초기 스키마
-- profiles / influencers / influencer_contacts / brands / brand_contacts /
-- campaigns / applications / matches
--
-- 개인 연락처(influencer_contacts, brand_contacts)는 공개 테이블과 물리적으로
-- 분리한다. 브랜드는 매칭 전까지 인플루언서 연락처 테이블에 접근할 수 없다 (RLS).

-- ---------------------------------------------------------------------------
-- 공통: updated_at 자동 갱신
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles : auth.users 1:1, 역할 보유
-- ---------------------------------------------------------------------------
create table public.profiles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references auth.users (id) on delete cascade,
  role       text not null check (role in ('influencer', 'brand', 'admin')),
  name       text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- influencers : 공개 프로필 (연락처 제외)
-- ---------------------------------------------------------------------------
create table public.influencers (
  id                  uuid primary key default gen_random_uuid(),
  profile_id          uuid not null unique references public.profiles (id) on delete cascade,
  nickname            text,
  xiaohongshu_id      text,
  xiaohongshu_url     text,
  follower_count      integer not null default 0 check (follower_count >= 0),
  categories          text[] not null default '{}',
  collaboration_types text[] not null default '{}',
  bio                 text,
  avatar_url          text,
  status              text not null default 'active'
                        check (status in ('active', 'inactive', 'pending')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_influencers_profile on public.influencers (profile_id);
create index idx_influencers_status on public.influencers (status);

create trigger trg_influencers_updated_at
before update on public.influencers
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- influencer_contacts : 비공개 연락처 (본인 / 운영자 / 매칭된 브랜드만)
-- ---------------------------------------------------------------------------
create table public.influencer_contacts (
  id            uuid primary key default gen_random_uuid(),
  influencer_id uuid not null unique references public.influencers (id) on delete cascade,
  wechat_id     text,
  email         text,
  phone         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger trg_influencer_contacts_updated_at
before update on public.influencer_contacts
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- brands : 공개 브랜드 정보 (담당자 연락처 제외)
-- ---------------------------------------------------------------------------
create table public.brands (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null unique references public.profiles (id) on delete cascade,
  brand_name  text,
  logo_url    text,
  description text,
  category    text,
  website     text,
  status      text not null default 'active'
                check (status in ('active', 'inactive', 'pending')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_brands_profile on public.brands (profile_id);

create trigger trg_brands_updated_at
before update on public.brands
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- brand_contacts : 비공개 담당자 연락처 (본인 / 운영자만)
-- ---------------------------------------------------------------------------
create table public.brand_contacts (
  id             uuid primary key default gen_random_uuid(),
  brand_id       uuid not null unique references public.brands (id) on delete cascade,
  contact_name   text,
  contact_wechat text,
  contact_phone  text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger trg_brand_contacts_updated_at
before update on public.brand_contacts
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- campaigns
-- ---------------------------------------------------------------------------
create table public.campaigns (
  id                   uuid primary key default gen_random_uuid(),
  brand_id             uuid not null references public.brands (id) on delete cascade,
  title                text not null,
  product_name         text,
  category             text,
  description          text,
  platform             text,
  recruitment_count    integer not null default 1 check (recruitment_count >= 1),
  minimum_followers    integer not null default 0 check (minimum_followers >= 0),
  creator_categories   text[] not null default '{}',
  compensation_type    text check (compensation_type in
                         ('paid', 'free_product', 'commission', 'mixed')),
  compensation_detail  text,
  budget               numeric(12, 2) check (budget is null or budget >= 0),
  product_provided     boolean not null default false,
  content_requirements text,
  recruit_start_date   date,
  recruit_end_date     date,
  collab_start_date    date,
  collab_end_date      date,
  status               text not null default 'draft'
                         check (status in ('draft', 'recruiting', 'closed', 'completed')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index idx_campaigns_brand on public.campaigns (brand_id);
create index idx_campaigns_status on public.campaigns (status);

create trigger trg_campaigns_updated_at
before update on public.campaigns
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- applications : 인플루언서 지원. past_collaboration / portfolio_links /
-- performance_summary 는 인플루언서 자율 기입값이며 Branreach 가 검증하지 않는다.
-- ---------------------------------------------------------------------------
create table public.applications (
  id                  uuid primary key default gen_random_uuid(),
  campaign_id         uuid not null references public.campaigns (id) on delete cascade,
  influencer_id       uuid not null references public.influencers (id) on delete cascade,
  message             text,
  strengths           text,
  past_collaboration  text,
  portfolio_links     text[] not null default '{}',
  performance_summary text,
  status              text not null default 'pending'
                        check (status in ('pending', 'accepted', 'rejected', 'matched')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (campaign_id, influencer_id)
);

create index idx_applications_campaign on public.applications (campaign_id);
create index idx_applications_influencer on public.applications (influencer_id);
create index idx_applications_status on public.applications (status);

create trigger trg_applications_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- matches : 운영자 수동 매칭
-- ---------------------------------------------------------------------------
create table public.matches (
  id             uuid primary key default gen_random_uuid(),
  campaign_id    uuid not null references public.campaigns (id) on delete cascade,
  influencer_id  uuid not null references public.influencers (id) on delete cascade,
  application_id uuid references public.applications (id) on delete set null,
  status         text not null default 'matched'
                   check (status in ('matched', 'in_progress', 'completed', 'cancelled')),
  matched_at     timestamptz not null default now(),
  completed_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (campaign_id, influencer_id)
);

create index idx_matches_campaign on public.matches (campaign_id);
create index idx_matches_influencer on public.matches (influencer_id);

create trigger trg_matches_updated_at
before update on public.matches
for each row execute function public.set_updated_at();

-- 매칭이 생성되면 해당 지원서를 matched 로 동기화
create or replace function public.sync_application_on_match()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.applications
  set status = 'matched'
  where campaign_id = new.campaign_id
    and influencer_id = new.influencer_id;
  return new;
end;
$$;

create trigger trg_match_sync_application
after insert on public.matches
for each row execute function public.sync_application_on_match();

-- ---------------------------------------------------------------------------
-- 회원가입 처리: auth.users 생성 시 profiles + 역할별 행 자동 생성
-- role / name 은 signUp 시 options.data 로 전달된다.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_role         text := coalesce(new.raw_user_meta_data ->> 'role', '');
  v_name         text := nullif(trim(new.raw_user_meta_data ->> 'name'), '');
  v_profile_id   uuid;
  v_influencer_id uuid;
  v_brand_id     uuid;
begin
  if v_role not in ('influencer', 'brand') then
    raise exception 'signup: 유효하지 않은 역할 (%)', v_role;
  end if;

  insert into public.profiles (user_id, role, name)
  values (new.id, v_role, v_name)
  returning id into v_profile_id;

  if v_role = 'influencer' then
    insert into public.influencers (profile_id, nickname)
    values (v_profile_id, v_name)
    returning id into v_influencer_id;

    insert into public.influencer_contacts (influencer_id)
    values (v_influencer_id);
  else
    insert into public.brands (profile_id, brand_name)
    values (v_profile_id, v_name)
    returning id into v_brand_id;

    insert into public.brand_contacts (brand_id)
    values (v_brand_id);
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();


-- ============================================================
-- supabase/migrations/20260910120002_functions.sql
-- ============================================================

-- RLS 정책에서 사용하는 헬퍼 함수.
-- 모두 SECURITY DEFINER 이며, profiles/influencers/brands 를 RLS 재귀 없이 읽는다.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.my_profile_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select id from public.profiles where user_id = auth.uid();
$$;

create or replace function public.my_influencer_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select i.id
  from public.influencers i
  join public.profiles p on p.id = i.profile_id
  where p.user_id = auth.uid();
$$;

create or replace function public.my_brand_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select b.id
  from public.brands b
  join public.profiles p on p.id = b.profile_id
  where p.user_id = auth.uid();
$$;

-- 랜딩 통계 (로그인 없이 호출 가능). 테이블 행을 노출하지 않고 집계만 반환.
create or replace function public.landing_stats()
returns json
language sql
stable
security definer
set search_path = ''
as $$
  select json_build_object(
    'influencers', (select count(*) from public.influencers where status = 'active'),
    'brands',      (select count(*) from public.brands where status = 'active'),
    'campaigns',   (select count(*) from public.campaigns where status = 'recruiting')
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.my_profile_id() to authenticated;
grant execute on function public.my_influencer_id() to authenticated;
grant execute on function public.my_brand_id() to authenticated;
grant execute on function public.landing_stats() to anon, authenticated;


-- ============================================================
-- supabase/migrations/20260910120003_rls.sql
-- ============================================================

-- Row Level Security 정책.
-- 프론트엔드 가드가 아니라 이 정책이 실제 권한 경계다.

alter table public.profiles             enable row level security;
alter table public.influencers          enable row level security;
alter table public.influencer_contacts  enable row level security;
alter table public.brands               enable row level security;
alter table public.brand_contacts       enable row level security;
alter table public.campaigns            enable row level security;
alter table public.applications         enable row level security;
alter table public.matches              enable row level security;

-- ---------------------------------------------------------------------------
-- profiles : 본인 또는 운영자만. (INSERT 는 handle_new_user 트리거가 처리)
-- ---------------------------------------------------------------------------
create policy "profiles_select" on public.profiles
  for select using (user_id = auth.uid() or public.is_admin());

create policy "profiles_update" on public.profiles
  for update
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- 운영자가 아니면 role 변경 금지 (권한 상승 방지)
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'role 은 변경할 수 없습니다';
  end if;
  return new;
end;
$$;

create trigger trg_profiles_guard_role
before update on public.profiles
for each row execute function public.guard_profile_role();

create policy "profiles_delete" on public.profiles
  for delete using (public.is_admin());

-- ---------------------------------------------------------------------------
-- influencers : 공개 프로필. 로그인 사용자는 active 인플루언서 조회 가능.
-- ---------------------------------------------------------------------------
create policy "influencers_select" on public.influencers
  for select using (
    (auth.uid() is not null and status = 'active')
    or profile_id = public.my_profile_id()
    or public.is_admin()
  );

create policy "influencers_update" on public.influencers
  for update
  using (profile_id = public.my_profile_id() or public.is_admin())
  with check (profile_id = public.my_profile_id() or public.is_admin());

create policy "influencers_delete" on public.influencers
  for delete using (public.is_admin());

-- ---------------------------------------------------------------------------
-- influencer_contacts : 본인 / 운영자 / 매칭된 캠페인의 소유 브랜드
-- ---------------------------------------------------------------------------
create policy "influencer_contacts_select" on public.influencer_contacts
  for select using (
    influencer_id = public.my_influencer_id()
    or public.is_admin()
    or exists (
      select 1
      from public.matches m
      join public.campaigns c on c.id = m.campaign_id
      where m.influencer_id = influencer_contacts.influencer_id
        and c.brand_id = public.my_brand_id()
        and m.status in ('matched', 'in_progress', 'completed')
    )
  );

create policy "influencer_contacts_update" on public.influencer_contacts
  for update
  using (influencer_id = public.my_influencer_id() or public.is_admin())
  with check (influencer_id = public.my_influencer_id() or public.is_admin());

-- ---------------------------------------------------------------------------
-- brands : 공개 브랜드 정보
-- ---------------------------------------------------------------------------
create policy "brands_select" on public.brands
  for select using (
    (auth.uid() is not null and status = 'active')
    or profile_id = public.my_profile_id()
    or public.is_admin()
  );

create policy "brands_update" on public.brands
  for update
  using (profile_id = public.my_profile_id() or public.is_admin())
  with check (profile_id = public.my_profile_id() or public.is_admin());

create policy "brands_delete" on public.brands
  for delete using (public.is_admin());

-- ---------------------------------------------------------------------------
-- brand_contacts : 본인 / 운영자만
-- ---------------------------------------------------------------------------
create policy "brand_contacts_select" on public.brand_contacts
  for select using (brand_id = public.my_brand_id() or public.is_admin());

create policy "brand_contacts_update" on public.brand_contacts
  for update
  using (brand_id = public.my_brand_id() or public.is_admin())
  with check (brand_id = public.my_brand_id() or public.is_admin());

-- ---------------------------------------------------------------------------
-- campaigns : 공개(모집중/마감/완료)는 로그인 사용자 조회 가능.
-- draft 는 소유 브랜드만. 생성/수정은 소유 브랜드.
-- ---------------------------------------------------------------------------
create policy "campaigns_select" on public.campaigns
  for select using (
    (auth.uid() is not null and status in ('recruiting', 'closed', 'completed'))
    or brand_id = public.my_brand_id()
    or public.is_admin()
  );

create policy "campaigns_insert" on public.campaigns
  for insert with check (brand_id = public.my_brand_id());

create policy "campaigns_update" on public.campaigns
  for update
  using (brand_id = public.my_brand_id() or public.is_admin())
  with check (brand_id = public.my_brand_id() or public.is_admin());

create policy "campaigns_delete" on public.campaigns
  for delete using (public.is_admin());

-- ---------------------------------------------------------------------------
-- applications :
--  - 인플루언서: 본인 지원서 조회 / 생성 / (pending 상태에서) 수정
--  - 브랜드: 자기 캠페인의 지원서 조회 / 상태 변경(pending·accepted·rejected)
--  - 운영자: 전체
-- ---------------------------------------------------------------------------
create policy "applications_select" on public.applications
  for select using (
    influencer_id = public.my_influencer_id()
    or public.is_admin()
    or exists (
      select 1 from public.campaigns c
      where c.id = applications.campaign_id
        and c.brand_id = public.my_brand_id()
    )
  );

create policy "applications_insert" on public.applications
  for insert with check (
    influencer_id = public.my_influencer_id()
    and exists (
      select 1 from public.campaigns c
      where c.id = campaign_id and c.status = 'recruiting'
    )
  );

create policy "applications_update_influencer" on public.applications
  for update
  using (influencer_id = public.my_influencer_id() and status = 'pending')
  with check (influencer_id = public.my_influencer_id());

create policy "applications_update_brand" on public.applications
  for update
  using (
    exists (
      select 1 from public.campaigns c
      where c.id = applications.campaign_id
        and c.brand_id = public.my_brand_id()
    )
  )
  with check (
    exists (
      select 1 from public.campaigns c
      where c.id = applications.campaign_id
        and c.brand_id = public.my_brand_id()
    )
    and status in ('pending', 'accepted', 'rejected')
  );

create policy "applications_admin_all" on public.applications
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- matches : 조회는 참여 당사자 + 운영자. 생성/수정/삭제는 운영자만.
-- ---------------------------------------------------------------------------
create policy "matches_select" on public.matches
  for select using (
    influencer_id = public.my_influencer_id()
    or public.is_admin()
    or exists (
      select 1 from public.campaigns c
      where c.id = matches.campaign_id
        and c.brand_id = public.my_brand_id()
    )
  );

create policy "matches_admin_all" on public.matches
  for all
  using (public.is_admin())
  with check (public.is_admin());


-- ============================================================
-- supabase/migrations/20260910120004_storage.sql
-- ============================================================

-- Storage 버킷: avatars (인플루언서 프로필 이미지), brand-logos (브랜드 로고).
-- 둘 다 공개 읽기. 쓰기는 로그인 사용자가 자기 폴더(<uid>/...)에만.

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('brand-logos', 'brand-logos', true)
on conflict (id) do nothing;

-- avatars ----------------------------------------------------------------
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_owner_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "avatars_owner_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "avatars_owner_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

-- brand-logos ----------------------------------------------------------------
create policy "brand_logos_public_read" on storage.objects
  for select using (bucket_id = 'brand-logos');

create policy "brand_logos_owner_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'brand-logos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "brand_logos_owner_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'brand-logos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "brand_logos_owner_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'brand-logos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

