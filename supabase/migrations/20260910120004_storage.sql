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
