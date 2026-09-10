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
