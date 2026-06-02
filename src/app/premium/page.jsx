import { Crown, Sparkles, ShieldCheck, TrendingUp, Rocket, BadgeCheck } from "lucide-react";
import BackButton from "../../components/ui/BackBtn"; 

const benefits = [
  {
    title: "Ad-Free Experience",
    description: "Enjoy a clean, distraction-free feed crafted for creators and professionals.",
    icon: Sparkles,
  },
  {
    title: "Verified Growth",
    description: "Boost your visibility with premium reach and verified discovery features.",
    icon: ShieldCheck,
  },
  {
    title: "Pro Analytics",
    description: "See performance metrics, audience trends, and smart growth insights.",
    icon: TrendingUp,
  },
  {
    title: "Creative Tools",
    description: "Access exclusive creator tools that make premium posts stand out.",
    icon: Rocket,
  },
];

const highlights = [
  "Priority posting and story boosts.",
  "Custom premium profile badge.",
  "Early access to new social features.",
  "Enhanced creator support and rewards.",
];

export default function PremiumPage() {
  return (
    <main className="min-h-screen px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          
          <section className="space-y-8">
            <BackButton className="mb-24" />
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200">
                <Crown className="h-4 w-4 text-emerald-300" />
                Premium experience
              </span>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Transform your social presence with Green Bird Premium.
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-emerald-100/80">
                Designed for creators, entrepreneurs, and professionals who need a faster, cleaner, and more powerful social experience.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="emerald-panel rounded-3xl border-white/10 bg-white/5 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-200">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 text-xl font-bold text-white">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-emerald-100/75">{item.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-black/40 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-12 w-12 rounded-3xl bg-gradient-to-br from-emerald-400/30 via-emerald-300/20 to-sky-500/15 p-3 text-emerald-100 shadow-[0_0_35px_rgba(16,185,129,0.15)]">
                  <BadgeCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200">Why Premium works</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">A polished experience built for influence.</h2>
                </div>
              </div>

              <ul className="grid gap-3 text-sm text-emerald-100/70 sm:grid-cols-2">
                {highlights.map((item) => (
                  <li key={item} className="flex gap-3 rounded-3xl border border-emerald-300/10 bg-white/5 px-4 py-3 text-white/90">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <aside className="space-y-6 rounded-[2rem] border border-emerald-300/10 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_55%),_radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.14),_transparent_45%),_rgba(8,15,23,0.96)] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-emerald-200">Premium tier</p>
                <h2 className="mt-4 text-4xl font-extrabold text-white">Pro</h2>
                <p className="mt-2 text-sm text-emerald-100/70">Best for ambitious creators who want the full suite of premium tools.</p>
              </div>
              <div className="rounded-3xl bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-100">Most popular</div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl bg-black/30 p-5">
                <p className="text-sm text-emerald-100/70">Full premium access</p>
                <p className="mt-3 text-5xl font-black tracking-tight text-white">$14<span className="text-2xl font-semibold">/mo</span></p>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-white">What you get</p>
                  <ul className="mt-4 space-y-3 text-sm text-emerald-100/75">
                    <li>Unlimited premium posts</li>
                    <li>Advanced insights dashboard</li>
                    <li>Removed ads and noise</li>
                    <li>Priority support & feature access</li>
                  </ul>
                </div>

                <button className="premium-button w-full rounded-full px-6 py-4 text-base font-semibold">
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
