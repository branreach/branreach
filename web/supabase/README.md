# Supabase

## 마이그레이션 적용 (원격 프로젝트)

Docker 없이 원격 프로젝트에 직접 적용한다.

```bash
# 1. Supabase CLI 로그인 (브라우저 인증, 1회)
npx supabase login

# 2. 원격 프로젝트 연결 (DB 비밀번호 입력)
npx supabase link --project-ref grgofykfeusvsexutepp

# 3. 마이그레이션 적용
npm run db:push

# 4. 타입 재생성
npm run db:types
```

## 마이그레이션 목록

| 파일 | 내용 |
| --- | --- |
| `20260910120001_schema.sql` | 테이블 8개, 인덱스, updated_at 트리거, `handle_new_user`(가입 시 profiles + 역할 행 자동 생성), `sync_application_on_match` |
| `20260910120002_functions.sql` | RLS 헬퍼(`is_admin`, `my_profile_id`, `my_influencer_id`, `my_brand_id`), `landing_stats` |
| `20260910120003_rls.sql` | 전체 RLS 정책 + role 변경 방지 트리거 |
| `20260910120004_storage.sql` | `avatars` / `brand-logos` 버킷 + 정책 |

## 운영자(admin) 계정 만들기

Admin 은 일반 회원가입으로 생성하지 않는다 (PRD §19). 순서:

1. 일반적으로 회원가입 (influencer 또는 brand 로) — 또는 Supabase Dashboard > Authentication 에서 사용자 생성
2. Supabase Dashboard > SQL Editor 에서 해당 사용자의 profile role 을 변경:

```sql
update public.profiles
set role = 'admin'
where user_id = (select id from auth.users where email = 'ADMIN_EMAIL@example.com');
```

`role` 변경은 트리거(`guard_profile_role`)가 막지만, SQL Editor 는 `postgres` 권한으로
실행되어 트리거 내부 `is_admin()` 검사와 무관하게 적용된다. (트리거는
`security definer` 로 `is_admin()` 를 호출하는데, SQL Editor 세션에는 `auth.uid()` 가
없어 `false` 가 되므로 아래처럼 트리거를 잠시 우회해야 할 수 있다.)

권장: 트리거를 잠깐 비활성화하고 변경:

```sql
alter table public.profiles disable trigger trg_profiles_guard_role;
update public.profiles set role = 'admin'
  where user_id = (select id from auth.users where email = 'ADMIN_EMAIL@example.com');
alter table public.profiles enable trigger trg_profiles_guard_role;
```

## 로컬 인증 설정 (개발 편의)

Dashboard > Authentication > Sign In / Providers > Email:

- **Confirm email**: 개발 중에는 OFF 권장 (가입 즉시 로그인). 배포 전 ON.
