import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingCta, LandingFooter } from "@/components/landing/landing-cta";
import { LandingHeader } from "@/components/landing/landing-header";
import { NetworkStats } from "@/components/landing/network-stats";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <LandingHeader />
      <main className="flex-1">
        <Hero />
        <NetworkStats />
        <HowItWorks />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
