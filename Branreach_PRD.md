# Branreach 양면 마켓플레이스 MVP PRD

## -1. 작업 환경

**로컬 작업 폴더**: `C:\Users\leeta\Desktop\Branreach`

Claude Code는 이 폴더를 프로젝트 루트로 사용한다.

**Git 운영 원칙**:
- 이 폴더에 git 저장소가 없다면 최초 작업 시 `git init`으로 생성한다.
- PRD 기반 기능 구현, DB 스키마 변경, 주요 UI 반영 등 **작업 단위가 크게 반영될 때마다 자동으로 git commit**을 생성한다.
- 커밋 메시지는 변경 내용을 간단히 요약해서 작성한다.
- GitHub 원격 저장소(origin)는 추후 링크가 제공되면 연결한다. 그 전까지는 로컬 커밋만 쌓는다.

## 0. 문서 목적

이 문서는 **Branreach MVP의 제품 요구사항 기준 문서**다.

Claude Code는 구현 전에 이 문서를 반드시 읽고, 아래 요구사항을 제품 구현의 기준으로 삼는다.

- PRD에 없는 기능을 임의로 추가하지 않는다.
- MVP는 실제 사용자 확보와 거래 흐름 검증이 목적이다.
- 자동 매칭보다 **실제 데이터가 쌓이고 양쪽 사용자가 서로의 존재를 확인할 수 있는 구조**를 우선한다.
- 복잡한 자동화보다 단순하고 안정적인 구현을 우선한다.

---

# 1. Product Overview

## 1.1 서비스명

**Branreach**

## 1.2 한 줄 설명

> 한국 브랜드와 중국 인플루언서를 연결하는 크로스보더 인플루언서 매칭 플랫폼

## 1.3 핵심 가치

Branreach는 한국 브랜드가 중국 시장에 진출할 때 필요한 중국 인플루언서 협업을 쉽게 찾고 진행할 수 있도록 연결한다.

반대로 중국 인플루언서는 한국 브랜드의 협업 캠페인을 발견하고 직접 지원할 수 있다.

### 핵심 구조

```text
한국 브랜드
    ↓
캠페인 등록
    ↓
Branreach
    ↓
중국 인플루언서
    ↓
캠페인 지원
    ↓
Branreach가 매칭 및 협업 진행
```

---

# 2. Problem

## 2.1 브랜드의 문제

한국 브랜드가 중국 시장에 진출하려 할 때:

- 중국 현지 인플루언서를 찾기 어렵다.
- 인플루언서에게 직접 연락하기 어렵다.
- 중국어 커뮤니케이션 장벽이 있다.
- 적절한 인플루언서를 비교하기 어렵다.
- 광고 → 관심 → 구매로 이어지는 연결이 어렵다.
- Xiaohongshu(小红书) 등 중국 플랫폼의 외부 링크 정책 때문에 판매 전환 구조가 복잡하다.
- 중국 내 결제, 물류, 통관, CS, 정산 등 운영 장벽이 존재한다.

## 2.2 인플루언서의 문제

중국 인플루언서 입장에서는:

- 한국 브랜드 협업 기회를 지속적으로 찾기 어렵다.
- 해외 브랜드와 협업할 때 커뮤니케이션이 어렵다.
- 브랜드의 협업 조건을 한눈에 비교하기 어렵다.
- 브랜드와의 계약/제품 수령/협업 과정이 분산되어 있다.

---

# 3. Target Users

## 3.1 Influencer

중국 내에서 Xiaohongshu 등 SNS를 운영하는 인플루언서.

주요 정보:

- 닉네임
- Xiaohongshu ID
- Xiaohongshu URL
- 팔로워 수
- 콘텐츠 카테고리
- 협업 유형
- 자기소개
- 프로필 이미지

개인 연락처:

- WeChat ID
- Email
- Phone

개인 연락처는 **매칭 전 브랜드에게 공개하지 않는다.**

---

## 3.2 Brand

중국 시장 진출을 원하는 한국 브랜드.

주요 정보:

- 브랜드명
- 로고
- 브랜드 설명
- 카테고리
- 웹사이트
- 담당자명
- 연락처

---

## 3.3 Admin

Branreach 운영자.

주요 역할:

- 인플루언서 관리
- 브랜드 관리
- 캠페인 관리
- 지원서 관리
- 실제 매칭 관리

MVP에서는 자동 매칭 알고리즘을 만들지 않는다.

**Admin이 수동으로 매칭한다.**

---

# 4. MVP Goal

MVP의 가장 중요한 목적은 다음 세 가지를 검증하는 것이다.

### 1. 인플루언서 확보

실제로 중국 인플루언서가 Branreach에 가입하고 프로필을 등록하는가?

### 2. 브랜드 수요

한국 브랜드가 실제로 중국 인플루언서 캠페인을 등록하려 하는가?

브랜드는 캠페인을 올리기 전, 인플루언서의 과거 협업 성과·레퍼런스를 보고 예산 대비 기대 효과를 판단하고 싶어한다. 이를 위해 인플루언서 지원 시 과거 성과를 직접 입력하도록 한다 (8.5, 14, 17.5 참고).

### 3. 매칭 발생

브랜드 캠페인 → 인플루언서 지원 → 실제 매칭까지 이어지는가?

---

# 5. MVP Scope

## 포함

- 회원가입
- 로그인
- 역할 선택
- Influencer 프로필
- Brand 프로필
- 캠페인 등록
- 캠페인 목록
- 캠페인 상세
- 캠페인 지원
- 지원 내역
- 인플루언서 풀
- 인플루언서 상세
- 브랜드 캠페인 관리
- 지원자 관리
- Admin 관리
- 수동 매칭
- Supabase DB
- Supabase Auth
- Supabase Storage
- RLS
- Responsive Web

## 제외

MVP에서는 다음을 구현하지 않는다.

- AI 매칭
- 자동 매칭
- 실시간 채팅
- 플랫폼 내 결제
- 정산 자동화
- 세금 계산
- 배송 관리 시스템
- 계약서 자동 생성
- 리뷰 시스템
- 평점 시스템
- AI 추천
- Xiaohongshu API
- WeChat API
- 자동 번역 시스템
- 복잡한 CRM
- 고급 분석 대시보드

필요할 경우 이후 단계에서 추가한다.

---

# 6. Product Architecture

## 6.1 Common Landing

로그인하지 않은 사용자가 처음 보는 페이지.

### Hero

**Korean Brands × Chinese Influencers**

한국 브랜드와 중국 인플루언서를 연결합니다.

### CTA

- 인플루언서로 시작하기
- 브랜드로 시작하기

### Network Stats

실제 DB의 데이터를 기반으로 표시한다.

예:

- 등록 인플루언서 수
- 등록 브랜드 수
- 진행 캠페인 수

**숫자를 임의로 하드코딩하지 않는다.**

---

# 7. Role-based Experience

Landing 이후에는 역할에 따라 완전히 다른 경험을 제공한다.

```text
Landing
   │
   ├── Influencer
   │      ├── Signup / Login
   │      ├── Dashboard
   │      ├── Campaigns
   │      ├── Campaign Detail
   │      ├── Apply
   │      ├── My Applications
   │      └── Profile
   │
   └── Brand
          ├── Signup / Login
          ├── Dashboard
          ├── Influencer Pool
          ├── Influencer Detail
          ├── Campaign Create
          ├── My Campaigns
          ├── Applicants
          └── Matching
```

---

# 8. Influencer Experience

## 8.1 Signup

필수:

- Email
- Password
- 역할: Influencer

가입 완료 후 Influencer Profile을 입력한다.

> **결정 사항**: MVP 초기에는 오픈형 회원가입을 사용한다 (초대 코드 없이 누구나 가입 가능). 초대 코드 기반 가입 제한은 이후 단계에서 필요 시 추가한다 (profiles 테이블에 invite_code/invited_by 컬럼 추가 예정).

---

## 8.2 Influencer Dashboard

주요 정보:

- 새로운 캠페인
- 지원한 캠페인 수
- 지원 상태
- 매칭된 캠페인
- 프로필 완성도

CTA:

- 캠페인 찾아보기
- 프로필 수정

---

## 8.3 Campaign List

인플루언서가 지원할 수 있는 캠페인을 조회한다.

카드에 표시:

- 브랜드명
- 캠페인 제목
- 제품명
- 카테고리
- 보상 방식
- 모집 인원
- 모집 기간
- 최소 팔로워
- 플랫폼

필터:

- 카테고리
- 보상 방식
- 최소 팔로워
- 모집 상태

---

## 8.4 Campaign Detail

표시 정보:

- 브랜드
- 캠페인 제목
- 제품명
- 캠페인 설명
- 콘텐츠 요구사항
- 모집 인원
- 최소 팔로워
- 모집 기간
- 활동 기간
- 보상
- 제품 제공 여부
- 지원 조건

CTA:

**캠페인 지원하기**

이미 지원했다면:

**지원 완료**

---

## 8.5 Apply

지원 시:

- 간단한 지원 메시지
- 선택적으로 본인의 강점/협업 경험

### 과거 협업 성과 / 레퍼런스 (인플루언서 직접 입력)

브랜드가 캠페인 등록 시 예산 대비 기대 성과를 판단할 수 있도록, 지원 단계에서 인플루언서가 아래 항목을 **직접 입력**한다.

- 과거 협업 브랜드/제품 (자유 텍스트, 선택)
- 대표 콘텐츠 링크 (Xiaohongshu 게시물 URL 등, 복수 입력 가능)
- 성과 지표 (자율 입력): 조회수 / 좋아요 / 판매 전환 여부 등

**중요**: 이 정보는 인플루언서 본인이 자율적으로 입력하는 값이며, Branreach가 사실 여부를 검증하지 않는다. UI에는 "본인이 입력한 정보이며 Branreach가 검증하지 않았습니다" 문구를 표시한다.

지원 후 상태:

- Pending
- Accepted
- Rejected
- Matched

---

## 8.6 My Applications

지원한 캠페인 목록.

각 지원 상태를 표시한다.

- 검토 중
- 선정
- 미선정
- 매칭 완료

---

## 8.7 Influencer Profile

공개 정보:

- 프로필 이미지
- 닉네임
- Xiaohongshu ID
- Xiaohongshu URL
- 팔로워 수
- 카테고리
- 협업 유형
- 자기소개

비공개 정보:

- WeChat
- Email
- Phone

비공개 정보는 Admin과 본인만 접근 가능하다.

---

# 9. Brand Experience

## 9.1 Signup

필수:

- Email
- Password
- 역할: Brand

가입 후 브랜드 정보를 입력한다.

---

## 9.2 Brand Dashboard

주요 정보:

- 등록한 캠페인 수
- 모집 중인 캠페인
- 지원자 수
- 매칭된 인플루언서 수

CTA:

- 캠페인 등록
- 인플루언서 찾아보기

---

# 10. Influencer Pool

브랜드가 공개된 인플루언서 정보를 조회할 수 있다.

카드:

- 프로필 이미지
- 닉네임
- 팔로워 수
- 카테고리
- 협업 유형
- 간단한 소개

검색/필터:

- 카테고리
- 팔로워 수
- 협업 유형

### 중요

브랜드는 매칭 전 다음 정보를 볼 수 없다.

- WeChat ID
- Email
- Phone

---

# 11. Influencer Detail

브랜드가 인플루언서 상세 정보를 확인한다.

표시:

- 프로필
- Xiaohongshu 정보
- 팔로워 수
- 카테고리
- 협업 가능 유형
- 자기소개

비공개:

- 직접 연락처

CTA:

**캠페인 등록하기**

MVP에서는 브랜드가 특정 인플루언서에게 직접 연락하지 않고 캠페인을 통해 지원을 받는 구조를 기본으로 한다.

---

# 12. Campaign Creation

브랜드가 협업 캠페인을 등록한다.

필드:

- 캠페인 제목
- 제품명
- 카테고리
- 캠페인 설명
- 플랫폼
- 모집 인원
- 최소 팔로워
- 원하는 인플루언서 카테고리
- 보상 방식
- 보상 상세
- 예산
- 제품 제공 여부
- 콘텐츠 요구사항
- 모집 시작일
- 모집 종료일
- 협업 시작일
- 협업 종료일

상태:

- Draft
- Recruiting
- Closed
- Completed

---

# 13. My Campaigns

브랜드가 등록한 캠페인을 관리한다.

각 캠페인:

- 상태
- 지원자 수
- 모집 인원
- 등록일
- 모집 기간

기능:

- 상세보기
- 수정
- 모집 종료
- 지원자 보기

---

# 14. Applicant Management

브랜드는 자신의 캠페인에 지원한 인플루언서를 볼 수 있다.

표시:

- 프로필
- 닉네임
- 팔로워 수
- 카테고리
- 지원 메시지
- 지원일
- 과거 협업 브랜드/제품 (인플루언서 자율 입력)
- 대표 콘텐츠 링크
- 성과 지표 (인플루언서 자율 입력, 미검증 표시 포함)

상태:

- Pending
- Accepted
- Rejected

매칭 이후:

- Matched

---

# 15. Matching

MVP에서는 자동 매칭하지 않는다.

흐름:

```text
Brand Campaign
      ↓
Influencer Application
      ↓
Brand / Admin 검토
      ↓
Admin이 최종 매칭
      ↓
Match 생성
```

매칭 테이블에는:

- campaign
- influencer
- status
- matched_at
- completed_at

등을 기록한다.

---

# 16. Admin

Admin은 별도의 관리자 영역을 가진다.

## Dashboard

표시:

- 총 인플루언서
- 총 브랜드
- 총 캠페인
- 총 지원
- 총 매칭

모든 숫자는 실제 DB 기반.

---

## Influencer Management

기능:

- 목록
- 검색
- 상세
- 상태 변경
- 비공개 연락처 확인
- 삭제/비활성화

---

## Brand Management

기능:

- 목록
- 상세
- 상태 변경
- 삭제/비활성화

---

## Campaign Management

기능:

- 전체 캠페인 조회
- 상태 변경
- 삭제/비활성화

---

## Application Management

기능:

- 전체 지원서 조회
- 상태 확인
- 지원서 관리

---

## Matching Management

기능:

- 캠페인 선택
- 인플루언서 선택
- 매칭 생성
- 매칭 상태 변경

MVP에서는 Admin이 수동으로 매칭한다.

---

# 17. Database

Supabase PostgreSQL을 사용한다.

## 17.1 profiles

```text
id
user_id
role
name
avatar_url
created_at
updated_at
```

role:

```text
influencer
brand
admin
```

---

## 17.2 influencers

```text
id
profile_id
nickname
xiaohongshu_id
xiaohongshu_url
wechat_id
email
phone
follower_count
categories
collaboration_types
bio
status
created_at
updated_at
```

---

## 17.3 brands

```text
id
profile_id
brand_name
logo_url
description
category
website
contact_name
contact_wechat
contact_phone
status
created_at
updated_at
```

---

## 17.4 campaigns

```text
id
brand_id
title
product_name
category
description
platform
recruitment_count
minimum_followers
creator_categories
compensation_type
compensation_detail
budget
product_provided
start_date
end_date
content_requirements
status
created_at
updated_at
```

---

## 17.5 applications

```text
id
campaign_id
influencer_id
message
past_collaboration
portfolio_links
performance_summary
status
created_at
updated_at
```

past_collaboration, portfolio_links, performance_summary는 인플루언서가 지원 시 직접 입력하는 자율 기입 항목이다. Branreach는 이 값의 사실 여부를 검증하지 않는다.

Unique constraint:

```text
campaign_id + influencer_id
```

한 인플루언서는 동일 캠페인에 중복 지원할 수 없다.

---

## 17.6 matches

```text
id
campaign_id
influencer_id
status
matched_at
completed_at
created_at
updated_at
```

---

# 18. Relationships

```text
auth.users
    │
    └── profiles
          │
          ├── influencer
          │      └── influencers
          │
          └── brand
                 └── brands

brands
   │
   └── campaigns
          │
          └── applications
                 │
                 └── influencers

campaigns
   │
   └── matches
          │
          └── influencers
```

---

# 19. Authentication

Supabase Auth 사용.

지원:

- Email + Password
- Login
- Logout
- Session persistence
- Password reset

회원가입 시:

1. Supabase Auth user 생성
2. profiles 생성
3. 선택한 role에 따라 influencer 또는 brand profile 생성

Admin은 일반 회원가입으로 생성하지 않는다.

---

# 20. Authorization / RLS

Supabase Row Level Security를 적극 사용한다.

## Influencer

자신의:

- profile
- influencer profile
- applications

생성/수정 가능.

공개된 캠페인은 조회 가능.

---

## Brand

자신의:

- profile
- brand profile
- campaigns

생성/수정 가능.

공개된 influencer 정보 조회 가능.

자신의 캠페인에 대한 applicants 조회 가능.

---

## Admin

모든 데이터 접근 가능.

---

# 21. Private Data Protection

가장 중요한 보안 요구사항 중 하나.

Influencer의 연락처:

- wechat_id
- email
- phone

은 브랜드에게 노출하지 않는다.

권장 구현:

- 공개 influencer 정보와 private contact 정보를 분리하거나
- RLS/View 정책을 사용해 역할별 조회 필드를 제한한다.

단순히 프론트엔드에서 CSS로 숨기는 방식은 사용하지 않는다.

---

# 22. Landing Stats

Landing에 표시하는 통계는 실제 DB에서 계산한다.

예:

```text
등록 인플루언서 24명
등록 브랜드 8개
진행 캠페인 5개
```

데이터가 없을 경우:

```text
0
```

을 표시한다.

임의의 숫자를 넣지 않는다.

---

# 23. Notifications

MVP에서는 복잡한 알림 시스템을 구현하지 않는다.

필요한 경우 UI에서 상태 변화만 명확하게 표시한다.

예:

- 지원 완료
- 지원 승인
- 지원 거절
- 매칭 완료

향후:

- Email
- WeChat
- Push

등으로 확장할 수 있다.

---

# 24. Responsive Design

반드시 Responsive Web으로 구현한다.

특히 중국 인플루언서는 모바일로 접근할 가능성이 높기 때문에:

- 모바일 우선
- 버튼 터치 영역 확보
- 카드형 UI
- 간단한 네비게이션

을 우선한다.

Brand/Admin은 데스크톱 사용성을 고려한다.

---

# 25. Design Direction

전체적인 디자인은:

- Clean
- Minimal
- Modern
- B2B SaaS
- International
- Trustworthy

느낌을 목표로 한다.

과도한 장식은 피한다.

핵심은:

> “한국 브랜드와 중국 인플루언서가 실제로 연결되는 플랫폼”

이라는 인상을 주는 것이다.

---

# 26. Core CTA

## Landing

### Influencer

**인플루언서로 시작하기**

### Brand

**브랜드로 시작하기**

---

## Influencer

**캠페인 지원하기**

---

## Brand

**캠페인 등록하기**

**인플루언서 찾아보기**

---

# 27. User Journey

## Influencer

```text
Landing
 ↓
인플루언서로 시작하기
 ↓
Signup
 ↓
Profile 작성
 ↓
Dashboard
 ↓
Campaign List
 ↓
Campaign Detail
 ↓
Apply
 ↓
My Applications
 ↓
Match
```

---

## Brand

```text
Landing
 ↓
브랜드로 시작하기
 ↓
Signup
 ↓
Brand Profile
 ↓
Dashboard
 ↓
Influencer Pool
 ↓
Influencer Detail
 ↓
Campaign Create
 ↓
Applicants
 ↓
Admin Matching
```

---

# 28. MVP Data Flow

핵심 데이터 흐름은 반드시 실제로 작동해야 한다.

```text
Influencer Signup
      ↓
profiles
      ↓
influencers
      ↓
Brand sees Influencer Pool
      ↓
Brand creates Campaign
      ↓
campaigns
      ↓
Influencer sees Campaign
      ↓
Influencer applies
      ↓
applications
      ↓
Brand/Admin reviews
      ↓
matches
```

이 흐름이 MVP의 핵심이다.

---

# 29. Tech Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui (필요한 경우)

## Backend / Database

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage

## Deployment

- Vercel

## Source Control

- GitHub

---

# 30. Recommended Project Structure

예시:

```text
app/
  page.tsx

  auth/
    login/
    signup/

  influencer/
    dashboard/
    campaigns/
    applications/
    profile/

  brand/
    dashboard/
    influencers/
    campaigns/
    applicants/

  admin/
    dashboard/
    influencers/
    brands/
    campaigns/
    applications/
    matches/

components/
  ui/
  landing/
  influencer/
  brand/
  admin/

lib/
  supabase/
  auth/
  utils/

types/

supabase/
  migrations/
```

구조는 실제 프로젝트 상황에 따라 합리적으로 변경할 수 있지만, PRD의 역할 분리는 유지한다.

---

# 31. Implementation Rules for Claude Code

Claude Code는 다음 규칙을 반드시 따른다.

## Rule 1

**PRD.md를 먼저 읽는다.**

---

## Rule 2

PRD에 없는 기능을 임의로 추가하지 않는다.

추가 기능이 필요하다고 판단되면 먼저 사용자에게 제안한다.

---

## Rule 3

MVP에서는 자동 매칭을 만들지 않는다.

Admin 수동 매칭이다.

---

## Rule 4

Influencer와 Brand의 사용자 경험을 명확하게 분리한다.

단순히 하나의 dashboard에 role만 바꾸는 수준이 아니라:

- navigation
- dashboard
- 주요 기능
- CTA

를 역할별로 다르게 구성한다.

---

## Rule 5

Supabase를 데이터의 Source of Truth로 사용한다.

실제 DB와 연결되지 않은 가짜 production data를 만들지 않는다.

---

## Rule 6

Landing의 통계 역시 실제 DB를 사용한다.

하드코딩된 숫자를 사용하지 않는다.

---

## Rule 7

개인 연락처를 브랜드에게 노출하지 않는다.

---

## Rule 8

RLS를 반드시 구현한다.

프론트엔드에서만 권한을 검사하지 않는다.

---

## Rule 9

보안보다 빠른 MVP를 위해 보안을 희생하지 않는다.

특히:

- Auth
- RLS
- private contact information

은 반드시 실제로 보호한다.

---

## Rule 10

과도한 추상화는 피한다.

MVP이므로:

- 단순한 컴포넌트
- 단순한 query
- 명확한 데이터 흐름

을 우선한다.

---

## Rule 11

기존 프로젝트 구조를 먼저 확인한다.

이미 존재하는 코드가 있다면 무작정 전체를 갈아엎지 않는다.

---

## Rule 12

큰 구조 변경 전에는 사용자에게 설명한다.

---

# 32. Implementation Order

Claude Code는 한 번에 전체 서비스를 만들지 않는다.

## Phase 1 — Foundation

- Next.js 프로젝트 확인
- Supabase 연결
- Auth
- DB schema
- migrations
- RLS
- 기본 layout
- role-based routing

## Phase 2 — Landing

- Hero
- Role CTA
- 실제 DB Stats
- How it works

## Phase 3 — Influencer

- Signup
- Profile
- Dashboard
- Campaign List
- Campaign Detail
- Apply
- My Applications

## Phase 4 — Brand

- Signup
- Profile
- Dashboard
- Influencer Pool
- Influencer Detail
- Campaign Create
- Campaign Management
- Applicant Management

## Phase 5 — Admin

- Dashboard
- Influencer Management
- Brand Management
- Campaign Management
- Application Management
- Manual Matching

## Phase 6 — QA / Deployment

- RLS 테스트
- 권한 테스트
- 모바일 테스트
- 주요 user flow 테스트
- Vercel deployment
- production 환경 변수 설정

---

# 33. Definition of Done

MVP는 다음 흐름이 실제 production 환경에서 동작하면 완료로 본다.

## Influencer Flow

```text
가입
→ 프로필 등록
→ 캠페인 확인
→ 캠페인 지원
→ 지원 상태 확인
```

## Brand Flow

```text
가입
→ 브랜드 등록
→ 인플루언서 확인
→ 캠페인 등록
→ 지원자 확인
```

## Admin Flow

```text
인플루언서 확인
→ 브랜드 확인
→ 캠페인 확인
→ 지원서 확인
→ 인플루언서 수동 매칭
```

## Security

- 로그인하지 않은 사용자는 private dashboard 접근 불가
- Influencer private contact 정보는 Brand에게 노출되지 않음
- Brand는 다른 Brand의 캠페인을 수정할 수 없음
- Influencer는 다른 Influencer의 private 정보를 수정할 수 없음
- 일반 사용자는 Admin 영역 접근 불가

---

# 34. MVP Success Criteria

기술적인 완성도보다 실제 사용 가능성을 우선한다.

최소한 다음 질문에 답할 수 있어야 한다.

### Supply

> 실제 중국 인플루언서가 Branreach에 가입하는가?

### Demand

> 실제 한국 브랜드가 캠페인을 등록하는가?

### Matching

> 실제 인플루언서가 캠페인에 지원하는가?

### Transaction

> 실제 브랜드와 인플루언서가 매칭되는가?

---

# 35. Product Principle

Branreach MVP의 핵심은 **“플랫폼처럼 보이는 것”이 아니라 “실제로 양쪽 사용자가 들어와서 연결되는 것”**이다.

따라서 초기에는:

```text
자동화 < 실제 사용
화려한 UI < 명확한 UX
복잡한 기능 < 핵심 흐름
AI 매칭 < 수동 운영
가짜 데이터 < 실제 데이터
```

를 우선한다.

---

# 36. First Claude Code Instruction

Claude Code에서 최초 구현을 시작할 때 다음 순서로 진행한다.

### Step 1 — 분석

```text
이 프로젝트의 PRD.md를 먼저 읽어줘.

이 문서를 Branreach MVP의 제품 요구사항 기준으로 삼아.

아직 코딩하지 말고 다음을 먼저 해줘.

1. 현재 프로젝트 구조 확인
2. 현재 구현된 기능 확인
3. PRD 요구사항을 구현 단위로 분해
4. 필요한 Supabase DB schema 설계
5. 필요한 RLS 정책 설계
6. 현재 코드와 PRD 사이의 차이점 정리
7. 구현 순서 제안

특히 Influencer와 Brand의 경험이 완전히 분리되어야 한다는 점과,
Influencer의 private contact 정보가 Brand에게 노출되면 안 된다는 점을 중요하게 확인해줘.

분석 결과를 보여준 후 내가 확인하면 구현을 시작해.
```

### Step 2 — Foundation 구현

분석을 검토한 후:

```text
좋아. 이제 Phase 1 Foundation을 구현해줘.

이번 단계에서는 다음만 구현해.

- Supabase 연결
- Auth
- DB schema
- migrations
- RLS
- profiles / influencers / brands / campaigns / applications / matches
- role-based routing
- 기본 layout

아직 Landing, Influencer UI, Brand UI, Admin UI는 본격적으로 만들지 마.

구현 후:
1. 변경한 파일
2. DB migration 내용
3. RLS 정책
4. 테스트한 내용
5. 다음 단계에서 할 작업

을 정리해줘.
```

---

# 37. Final Principle

**Branreach는 처음부터 완성된 플랫폼을 만드는 것이 목적이 아니다.**

첫 번째 목표는:

> “한국 브랜드가 캠페인을 올리고, 중국 인플루언서가 지원하고, 실제 매칭이 발생하는가?”

를 검증하는 것이다.

모든 구현 판단은 이 목표를 기준으로 한다.
