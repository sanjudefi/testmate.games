import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { games, getGameBySlug } from "@/lib/data/seo-pages";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return games.map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return { title: "Game Not Found" };
  }

  return {
    title: `${game.name} | Free Online Brain Game | TutorTom`,
    description: game.metaDescription,
    keywords: game.keywords,
    openGraph: {
      title: `${game.name} - ${game.tagline}`,
      description: game.metaDescription,
      url: `https://play.tutortom.ai/games/${game.slug}`,
      siteName: "TutorTom",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.name} | TutorTom`,
      description: game.metaDescription,
    },
    alternates: {
      canonical: `https://play.tutortom.ai/games/${game.slug}`,
    },
  };
}

export default async function GameLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const gameUrl = slug === "catch-the-fish"
    ? "https://play.tutortom.ai/brain-test/aim-trainer"
    : `https://play.tutortom.ai/brain-test/${slug}`;

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-8xl mb-6 block">{game.emoji}</span>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#4F7BFE] to-[#A855F7] bg-clip-text text-transparent">
            {game.name}
          </h1>
          <p className="text-2xl text-[#A855F7] mb-6">{game.tagline}</p>
          <p className="text-xl text-[#CBD5E1] mb-8 max-w-2xl mx-auto">
            {game.description}
          </p>
          <a
            href={gameUrl}
            className="inline-block bg-gradient-to-r from-[#4F7BFE] to-[#A855F7] text-white font-bold py-4 px-12 rounded-lg text-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Play Now - Free
          </a>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-[#1E293B]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Why Play {game.name}?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {game.benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-[#0F172A] rounded-lg"
              >
                <span className="text-2xl text-[#4F7BFE]">✓</span>
                <p className="text-[#CBD5E1] text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What It Improves Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Cognitive Skills This Game Improves
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {game.improves.map((skill, index) => (
              <span
                key={index}
                className="px-6 py-3 bg-gradient-to-r from-[#4F7BFE]/20 to-[#A855F7]/20 border border-[#4F7BFE] rounded-full text-white text-lg"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="py-16 px-4 bg-[#1E293B]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            How to Play
          </h2>
          <div className="space-y-4">
            {game.howToPlay.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-[#0F172A] rounded-lg"
              >
                <span className="w-10 h-10 flex items-center justify-center bg-[#4F7BFE] rounded-full text-white font-bold">
                  {index + 1}
                </span>
                <p className="text-[#CBD5E1] text-lg">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Test Your Brain?
          </h2>
          <p className="text-xl text-[#CBD5E1] mb-8">
            Join thousands of players training their minds with TutorTom
          </p>
          <a
            href={gameUrl}
            className="inline-block bg-gradient-to-r from-[#4F7BFE] to-[#A855F7] text-white font-bold py-4 px-12 rounded-lg text-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mb-8"
          >
            Start Playing Now
          </a>
          <div className="flex flex-wrap justify-center gap-4 text-[#CBD5E1]">
            <span>100% Free</span>
            <span>|</span>
            <span>No Signup Required</span>
            <span>|</span>
            <span>Instant Play</span>
          </div>
        </div>
      </section>

      {/* More Games Section */}
      <section className="py-16 px-4 bg-[#1E293B]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            More Brain Games
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {games
              .filter((g) => g.slug !== game.slug)
              .map((g) => (
                <Link
                  key={g.slug}
                  href={`/games/${g.slug}`}
                  className="p-4 bg-[#0F172A] rounded-lg text-center hover:bg-[#334155] transition-all"
                >
                  <span className="text-4xl block mb-2">{g.emoji}</span>
                  <span className="text-white font-medium">{g.name}</span>
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
