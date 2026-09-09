import type {
  ApplicationStatus,
  CampaignStatus,
  CompensationType,
  MatchStatus,
  UserRole,
} from "@/types/database";

/** 인플루언서 / 캠페인 공통 콘텐츠 카테고리. */
export const CATEGORIES = [
  "뷰티",
  "패션",
  "라이프스타일",
  "푸드",
  "육아",
  "여행",
  "테크",
  "홈/리빙",
  "헬스/피트니스",
  "펫",
] as const;

/** 협업 유형. */
export const COLLABORATION_TYPES = [
  "제품 협찬",
  "유료 광고",
  "공동구매",
  "방문 리뷰",
  "브랜드 앰배서더",
] as const;

/** 플랫폼. */
export const PLATFORMS = ["샤오홍슈(小红书)", "도우인(抖音)", "웨이보(微博)", "기타"] as const;

export const COMPENSATION_TYPE_LABEL: Record<CompensationType, string> = {
  paid: "유료 (고정 비용)",
  free_product: "제품 제공만",
  commission: "판매 수수료",
  mixed: "혼합 (비용 + 수수료)",
};

export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  draft: "작성 중",
  recruiting: "모집 중",
  closed: "모집 마감",
  completed: "완료",
};

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  pending: "검토 중",
  accepted: "선정",
  rejected: "미선정",
  matched: "매칭 완료",
};

export const MATCH_STATUS_LABEL: Record<MatchStatus, string> = {
  matched: "매칭됨",
  in_progress: "협업 진행 중",
  completed: "협업 완료",
  cancelled: "취소됨",
};

export const ROLE_LABEL: Record<UserRole, string> = {
  influencer: "인플루언서",
  brand: "브랜드",
  admin: "운영자",
};

/** 팔로워 수 필터 구간. */
export const FOLLOWER_TIERS = [
  { label: "1만 이상", value: 10_000 },
  { label: "5만 이상", value: 50_000 },
  { label: "10만 이상", value: 100_000 },
  { label: "50만 이상", value: 500_000 },
] as const;

export function formatFollowers(count: number): string {
  if (count >= 10_000) {
    const man = count / 10_000;
    return `${Number.isInteger(man) ? man : man.toFixed(1)}만`;
  }
  return count.toLocaleString("ko-KR");
}
