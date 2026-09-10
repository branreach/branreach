-- Phase 1 검증 중 생성된 테스트 계정 삭제.
-- auth.users 삭제 시 profiles → influencers/brands → contacts/campaigns/applications
-- 까지 ON DELETE CASCADE 로 함께 삭제된다.
-- Supabase Dashboard > SQL Editor 에서 실행.

delete from auth.users
where email like '%@branreach-test.com';

-- 확인: 0 이어야 함 (아직 실제 가입자가 없다면)
select
  (select count(*) from public.profiles)     as profiles,
  (select count(*) from public.influencers)   as influencers,
  (select count(*) from public.brands)        as brands,
  (select count(*) from public.campaigns)     as campaigns,
  (select count(*) from public.applications)  as applications;
