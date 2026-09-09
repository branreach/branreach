import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatFollowers } from "@/lib/constants";
import type { PublicInfluencer } from "@/lib/influencer-pool";

export function InfluencerCard({
  influencer,
  href,
}: {
  influencer: PublicInfluencer;
  href: string;
}) {
  const i = influencer;
  return (
    <Link
      href={href}
      className="flex flex-col rounded-xl border bg-card p-5 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarImage src={i.avatar_url ?? undefined} alt="" />
          <AvatarFallback>{i.nickname?.[0] ?? "?"}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-semibold">{i.nickname ?? "인플루언서"}</p>
          <p className="text-sm text-muted-foreground">
            팔로워 {formatFollowers(i.follower_count)}
          </p>
        </div>
      </div>

      {i.bio ? (
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
          {i.bio}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {i.categories.slice(0, 3).map((c) => (
          <Badge key={c} variant="outline">
            {c}
          </Badge>
        ))}
        {i.collaboration_types.slice(0, 2).map((t) => (
          <Badge key={t} variant="secondary">
            {t}
          </Badge>
        ))}
      </div>
    </Link>
  );
}
