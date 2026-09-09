const TRACKS = [
  {
    role: "브랜드",
    accent: "한국 브랜드",
    steps: [
      {
        title: "캠페인 등록",
        body: "제품, 협업 조건, 예산, 원하는 인플루언서 조건을 입력해 캠페인을 올립니다.",
      },
      {
        title: "지원자 확인",
        body: "지원한 인플루언서의 프로필과 인플루언서가 직접 입력한 과거 협업 성과를 비교합니다.",
      },
      {
        title: "매칭",
        body: "Branreach 운영팀이 최종 매칭을 진행하고, 매칭된 인플루언서의 연락처가 공개됩니다.",
      },
    ],
  },
  {
    role: "인플루언서",
    accent: "중국 인플루언서",
    steps: [
      {
        title: "프로필 등록",
        body: "샤오홍슈 정보, 팔로워 수, 콘텐츠 카테고리, 협업 유형을 등록합니다.",
      },
      {
        title: "캠페인 지원",
        body: "관심 있는 한국 브랜드 캠페인에 지원 메시지와 대표 콘텐츠를 담아 직접 지원합니다.",
      },
      {
        title: "협업 진행",
        body: "매칭이 확정되면 브랜드와 직접 연결되어 협업을 진행합니다.",
      },
    ],
  },
] as const;

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">
        이렇게 진행됩니다
      </h2>
      <p className="mt-3 text-center text-sm text-muted-foreground sm:text-base">
        자동 매칭이 아니라, 실제 데이터를 바탕으로 운영팀이 매칭을 돕습니다.
      </p>

      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-8">
        {TRACKS.map((track) => (
          <div key={track.role} className="rounded-xl border bg-card p-6 sm:p-7">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-muted-foreground">
                {track.accent}
              </span>
            </div>
            <ol className="mt-5 space-y-6">
              {track.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
