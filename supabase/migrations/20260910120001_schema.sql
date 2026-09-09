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
