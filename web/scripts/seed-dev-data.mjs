/**
 * 개발용 테스트 데이터 생성기.
 *
 *   node scripts/seed-dev-data.mjs
 *
 * .env.local 의 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 를 사용해
 * 테스트 브랜드 1개 + 모집 중 캠페인 여러 개를 만든다. 모든 계정 이메일은
 * @branreach-test.com 이므로 supabase/cleanup_test_data.sql 로 한 번에 삭제된다.
 *
 * ⚠️ 실제 운영 데이터가 아니다. 데모/QA 용도로만 사용한다.
 */
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const SB = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!SB || !ANON) {
  console.error(".env.local 에 Supabase URL/anon key 가 필요합니다.");
  process.exit(1);
}

const h = (token) => ({
  apikey: ANON,
  Authorization: `Bearer ${token ?? ANON}`,
  "Content-Type": "application/json",
});

const BRAND_EMAIL = `brand.demo.${Date.now()}@branreach-test.com`;
const PW = "Test1234pw";

async function main() {
  // 1. 브랜드 가입
  let res = await fetch(`${SB}/auth/v1/signup`, {
    method: "POST",
    headers: h(),
    body: JSON.stringify({
      email: BRAND_EMAIL,
      password: PW,
      data: { role: "brand", name: "글로우서울" },
    }),
  });
  if (!res.ok) throw new Error(`signup 실패: ${await res.text()}`);

  // 2. 로그인
  res = await fetch(`${SB}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: h(),
    body: JSON.stringify({ email: BRAND_EMAIL, password: PW }),
  });
  const { access_token: token } = await res.json();

  // 3. 브랜드 정보 채우기
  const brandRow = await (
    await fetch(`${SB}/rest/v1/brands?select=id`, { headers: h(token) })
  ).json();
  const brandId = brandRow[0].id;
  await fetch(`${SB}/rest/v1/brands?id=eq.${brandId}`, {
    method: "PATCH",
    headers: h(token),
    body: JSON.stringify({
      description: "한국 스킨케어 브랜드. 자연 유래 성분 중심의 기초 화장품을 만듭니다.",
      category: "뷰티",
      website: "https://example.com",
    }),
  });

  // 4. 캠페인 여러 개
  const campaigns = [
    {
      title: "신제품 세럼 샤오홍슈 리뷰 캠페인",
      product_name: "글로우 리페어 세럼",
      category: "뷰티",
      description:
        "신제품 세럼을 사용해보고 솔직한 사용 후기를 샤오홍슈에 올려주실 인플루언서를 찾습니다.",
      platform: "샤오홍슈(小红书)",
      recruitment_count: 5,
      minimum_followers: 10000,
      creator_categories: ["뷰티", "라이프스타일"],
      compensation_type: "mixed",
      compensation_detail: "제품 제공 + 게시물당 30만원 + 판매 수수료 5%",
      budget: 3000000,
      product_provided: true,
      content_requirements: "샤오홍슈 게시물 1건 (사진 5장 이상), 30일 내 업로드",
      status: "recruiting",
    },
    {
      title: "여름 선케어 공동구매 파트너 모집",
      product_name: "데일리 선스틱",
      category: "뷰티",
      description: "여름 시즌 선케어 제품 공동구매를 함께 진행할 인플루언서를 모집합니다.",
      platform: "샤오홍슈(小红书)",
      recruitment_count: 3,
      minimum_followers: 50000,
      creator_categories: ["뷰티"],
      compensation_type: "commission",
      compensation_detail: "판매액의 15% 수수료",
      budget: null,
      product_provided: true,
      content_requirements: "공동구매 홍보 게시물 2건 + 스토리",
      status: "recruiting",
    },
    {
      title: "라이프스타일 인플루언서 브랜드 앰배서더",
      product_name: "글로우서울 전 제품",
      category: "라이프스타일",
      description: "3개월간 브랜드 앰배서더로 활동할 인플루언서를 찾습니다.",
      platform: "샤오홍슈(小红书)",
      recruitment_count: 2,
      minimum_followers: 100000,
      creator_categories: ["라이프스타일", "뷰티"],
      compensation_type: "paid",
      compensation_detail: "월 200만원 x 3개월",
      budget: 6000000,
      product_provided: true,
      content_requirements: "월 2건 게시물, 분기 1회 라이브",
      status: "recruiting",
    },
  ];

  for (const c of campaigns) {
    const r = await fetch(`${SB}/rest/v1/campaigns`, {
      method: "POST",
      headers: h(token),
      body: JSON.stringify({ ...c, brand_id: brandId }),
    });
    console.log(r.ok ? `✓ ${c.title}` : `✗ ${c.title}: ${await r.text()}`);
  }

  console.log(`\n브랜드 계정: ${BRAND_EMAIL} / ${PW}`);
  console.log("정리: supabase/cleanup_test_data.sql 실행");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
