# Branreach

한국 브랜드와 중국 인플루언서를 연결하는 크로스보더 인플루언서 매칭 플랫폼 (MVP).

## 폴더 구조

```
Branreach/
├── 웹사이트-실행.cmd    ← 더블클릭하면 서버가 켜지고 브라우저가 열림
├── START-HERE.html      ← Chrome 으로 바로 열기 (프로젝트 현황 · 실행법 · 테스트 계정)
├── Branreach_PRD.md     ← 제품 요구사항 기준 문서
├── POC소개서/           ← 소개 자료 (PDF · PPTX)
└── web/                 ← 웹사이트 전체 (Next.js 앱)
    ├── app/  components/  lib/  types/
    ├── supabase/         ← DB 마이그레이션 · SQL
    ├── scripts/          ← 개발용 데이터 시드
    └── README.md         ← 앱 상세 문서
```

## 실행

**`웹사이트-실행.cmd` 더블클릭** → 잠시 후 http://localhost:3000 이 열립니다.
(첫 실행은 패키지 설치로 수 분 소요)

터미널로 직접:

```bash
cd web
npm install
npm run dev
```

자세한 내용은 [`web/README.md`](web/README.md) 와 `START-HERE.html` 참고.
