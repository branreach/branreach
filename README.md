# Branreach

한국 브랜드와 중국 인플루언서를 연결하는 크로스보더 인플루언서 매칭 플랫폼 (MVP).

기준 문서: `Branreach_PRD.md` (제품 요구사항). PRD에 없는 기능은 임의로 추가하지 않는다.

## 스택

- Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui
- Supabase (PostgreSQL · Auth · Storage · RLS)
- 배포: Vercel

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # 값 채우기 (아래 참고)
npm run dev
```

### 환경 변수 (`.env.local`)

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon 공개 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role 키 (서버 전용, Admin 기능에서만 사용) |
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL (비밀번호 재설정 링크 등) |

## 데이터베이스

마이그레이션은 `supabase/migrations/` 에 있다. 자세한 적용 방법은
[`supabase/README.md`](supabase/README.md) 참고.

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npm run db:push      # 마이그레이션 적용
npm run db:types     # types/database.ts 재생성
```

## 구조

```
app/
  (auth)/            로그인 / 회원가입 / 비밀번호 찾기
  auth/              인증 콜백, 비밀번호 변경
  influencer/        인플루언서 전용 영역 (역할 가드)
  brand/             브랜드 전용 영역 (역할 가드)
  admin/             운영자 전용 영역 (역할 가드)
components/ui/       shadcn/ui
lib/
  supabase/          client / server / middleware / admin
  auth/              세션·역할 헬퍼, 인증 서버 액션
  constants.ts       한국어 라벨 · 옵션
types/database.ts    Supabase 스키마 타입
supabase/migrations/ SQL 마이그레이션
```

## 구현 진행 (PRD §32)

- [x] **Phase 1 — Foundation**: Supabase 연결, Auth, 스키마, RLS, 역할 라우팅, 레이아웃 — API 레벨 검증 완료 (가입 트리거 / RLS / 연락처 격리 / 중복지원 / 권한)
- [ ] Phase 2 — Landing
- [ ] Phase 3 — Influencer
- [ ] Phase 4 — Brand
- [ ] Phase 5 — Admin
- [ ] Phase 6 — QA / 배포
