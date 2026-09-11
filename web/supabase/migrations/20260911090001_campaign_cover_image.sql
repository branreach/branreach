-- 캠페인 대표 이미지 (인플루언서 캠페인 목록 카드 가독성 개선용).
-- 선택 입력(nullable) — 기존 캠페인/기능에 영향 없음.

alter table public.campaigns
  add column cover_image_url text;

-- campaign-images 버킷: 공개 읽기, 본인(브랜드) 폴더에만 쓰기.
insert into storage.buckets (id, name, public)
values ('campaign-images', 'campaign-images', true)
on conflict (id) do nothing;

create policy "campaign_images_public_read" on storage.objects
  for select using (bucket_id = 'campaign-images');

create policy "campaign_images_owner_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'campaign-images'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "campaign_images_owner_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'campaign-images'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "campaign_images_owner_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'campaign-images'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
