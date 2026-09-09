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
