import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { seoPages, getSEOPageBySlug, getGamesForPage, games } from "@/lib/data/seo-pages";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return seoPages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSEOPageBySlug(slug);

  if (!page) {
    return { title: "Page Not Found" };
  }

  return {
    title: page.title,
    description: page.metaDescription,
    keywords: page.keywords,
    openGraph: {
      title: page.h1,
      description: page.metaDescription,
      url: `https://play.tutortom.ai/${page.slug}`,
      siteName: "TutorTom",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.metaDescription,
    },
    alternates: {
      canonical: `https://play.tutortom.ai/${page.slug}`,
    },
  };
}

export default async function SEOPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getSEOPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const featuredGames = getGamesForPage(page.games);

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#4F7BFE] to-[#A855F7] bg-clip-text text-transparent">
            {page.h1}
          </h1>
          <p className="text-xl text-[#CBD5E1] mb-8 max-w-2xl mx-auto">
            {page.content}
          </p>
          <a
            href="https://play.tutortom.ai"
            className="inline-block bg-gradient-to-r from-[#4F7BFE] to-[#A855F7] text-white font-bold py-4 px-12 rounded-lg text-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Play Now - Free
          </a>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="py-16 px-4 bg-[#1E293B]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Featured Brain Games
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGames.map((game) => {
              const gameUrl = game.slug === "catch-the-fish"
                ? "https://play.tutortom.ai/brain-test/aim-trainer"
                : `https://play.tutortom.ai/brain-test/${game.slug}`;

              return (
                <div
                  key={game.slug}
                  className="bg-[#0F172A] rounded-xl p-6 border border-[#334155] hover:border-[#4F7BFE] transition-all"
                >
                  <span className="text-5xl block mb-4">{game.emoji}</span>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {game.name}
                  </h3>
                  <p className="text-[#A855F7] text-sm mb-3">{game.tagline}</p>
                  <p className="text-[#CBD5E1] text-sm mb-4 line-clamp-2">
                    {game.description.substring(0, 100)}...
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {game.improves.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-[#4F7BFE]/20 text-[#4F7BFE] rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <a
                    href={gameUrl}
                    className="block w-full text-center bg-[#4F7BFE] hover:bg-[#A855F7] text-white font-bold py-3 px-6 rounded-lg transition-all"
                  >
                    Play Now
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Why Train Your Brain with TutorTom?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#1E293B] rounded-xl">
              <h3 className="text-xl font-bold text-[#4F7BFE] mb-3">
                Scientifically Designed
              </h3>
              <p className="text-[#CBD5E1]">
                Our games are based on cognitive science research and target specific mental abilities.
              </p>
            </div>
            <div className="p-6 bg-[#1E293B] rounded-xl">
              <h3 className="text-xl font-bold text-[#4F7BFE] mb-3">
                100% Free
              </h3>
              <p className="text-[#CBD5E1]">
                All games are completely free to play. No subscriptions, no hidden costs.
              </p>
            </div>
            <div className="p-6 bg-[#1E293B] rounded-xl">
              <h3 className="text-xl font-bold text-[#4F7BFE] mb-3">
                No Signup Required
              </h3>
              <p className="text-[#CBD5E1]">
                Start playing instantly. No accounts, no registration, no barriers.
              </p>
            </div>
            <div className="p-6 bg-[#1E293B] rounded-xl">
              <h3 className="text-xl font-bold text-[#4F7BFE] mb-3">
                Track Your Progress
              </h3>
              <p className="text-[#CBD5E1]">
                See your scores and measure your improvement over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All Games Section */}
      <section className="py-16 px-4 bg-[#1E293B]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            All Brain Games
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {games.map((game) => (
              <Link
                key={game.slug}
                href={`/games/${game.slug}`}
                className="p-6 bg-[#0F172A] rounded-lg text-center hover:bg-[#334155] transition-all border border-[#334155] hover:border-[#4F7BFE]"
              >
                <span className="text-4xl block mb-3">{game.emoji}</span>
                <span className="text-white font-medium block">{game.name}</span>
                <span className="text-[#CBD5E1] text-sm">{game.tagline}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Training Your Brain Today
          </h2>
          <p className="text-xl text-[#CBD5E1] mb-8">
            Join thousands of players improving their cognitive abilities with TutorTom
          </p>
          <a
            href="https://play.tutortom.ai"
            className="inline-block bg-gradient-to-r from-[#4F7BFE] to-[#A855F7] text-white font-bold py-4 px-12 rounded-lg text-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mb-8"
          >
            Play Free Brain Games Now
          </a>
          <div className="flex flex-wrap justify-center gap-4 text-[#CBD5E1]">
            <span>6 Brain Games</span>
            <span>|</span>
            <span>No Download</span>
            <span>|</span>
            <span>Instant Play</span>
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <section className="py-16 px-4 bg-[#1E293B]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Explore More
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {seoPages
              .filter((p) => p.slug !== page.slug)
              .slice(0, 12)
              .map((p) => (
                <Link
                  key={p.slug}
                  href={`/${p.slug}`}
                  className="px-4 py-2 bg-[#0F172A] rounded-full text-[#CBD5E1] hover:text-white hover:bg-[#334155] transition-all text-sm"
                >
                  {p.h1}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#334155]">
        <div className="max-w-4xl mx-auto text-center text-[#CBD5E1]">
          <p className="mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              TutorTom
            </Link>
            {" - "}Free Online Brain Games
          </p>
          <p className="text-sm">
            Train your brain with scientifically-designed cognitive games
          </p>
        </div>
      </footer>
    </div>
  );
}
