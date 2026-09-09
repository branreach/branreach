-- 테스트용 운영자 계정 승격.
-- admin@branreach-test.com 은 이미 가입되어 있다 (임시로 brand 역할).
-- 아래를 Supabase Dashboard > SQL Editor 에서 실행하면 admin 으로 승격되고
-- brand 로 가입되며 생긴 불필요한 행이 정리된다.

begin;

alter table public.profiles disable trigger trg_profiles_guard_role;

update public.profiles
set role = 'admin'
where user_id = (
  select id from auth.users where email = 'admin@branreach-test.com'
);

alter table public.profiles enable trigger trg_profiles_guard_role;

-- brand 가입 시 생성된 orphan 행 제거
delete from public.brands
where profile_id = (
  select id from public.profiles
  where user_id = (select id from auth.users where email = 'admin@branreach-test.com')
);

commit;

-- 확인
select p.role, u.email
from public.profiles p
join auth.users u on u.id = p.user_id
where u.email = 'admin@branreach-test.com';
