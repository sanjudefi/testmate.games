import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#4F7BFE] to-[#A855F7] bg-clip-text text-transparent">
            TestMate
          </h1>
          <p className="text-xl text-[#CBD5E1]">
            Challenge your brain with daily cognitive tests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Word Memory Test */}
          <Link href="/brain-test/word-memory">
            <div className="card-testmate p-8 hover:shadow-glow-blue transition-all cursor-pointer group">
              <div className="text-4xl mb-4">🧠</div>
              <h2 className="text-2xl font-bold mb-2 text-[#4F7BFE] group-hover:text-[#CBD5E1] transition-colors">
                Word Memory
              </h2>
              <p className="text-[#CBD5E1]">
                Remember 5 different words each round, 3 rounds
              </p>
            </div>
          </Link>

          {/* Number Memory Test */}
          <Link href="/brain-test/number-memory">
            <div className="card-testmate p-8 hover:shadow-glow-blue transition-all cursor-pointer group">
              <div className="text-4xl mb-4">🔢</div>
              <h2 className="text-2xl font-bold mb-2 text-[#4F7BFE] group-hover:text-[#CBD5E1] transition-colors">
                Number Memory
              </h2>
              <p className="text-[#CBD5E1]">
                Recall 3 different 6-digit numbers, one at a time
              </p>
            </div>
          </Link>

          {/* Chimp Test */}
          <Link href="/brain-test/chimp-test">
            <div className="card-testmate p-8 hover:shadow-glow-purple transition-all cursor-pointer group">
              <div className="text-4xl mb-4">🐵</div>
              <h2 className="text-2xl font-bold mb-2 text-[#A855F7] group-hover:text-[#CBD5E1] transition-colors">
                Chimp Test
              </h2>
              <p className="text-[#CBD5E1]">
                Click numbered squares in sequence from memory
              </p>
            </div>
          </Link>

          {/* Catch the Fish */}
          <Link href="/brain-test/aim-trainer">
            <div className="card-testmate p-8 hover:shadow-glow-purple transition-all cursor-pointer group">
              <div className="text-4xl mb-4">🐟</div>
              <h2 className="text-2xl font-bold mb-2 text-[#A855F7] group-hover:text-[#CBD5E1] transition-colors">
                Catch the Fish
              </h2>
              <p className="text-[#CBD5E1]">
                Catch fish as fast as you can for 10 seconds
              </p>
            </div>
          </Link>

          {/* Math Speed */}
          <Link href="/brain-test/math-speed">
            <div className="card-testmate p-8 hover:shadow-glow-purple transition-all cursor-pointer group">
              <div className="text-4xl mb-4">➕</div>
              <h2 className="text-2xl font-bold mb-2 text-[#A855F7] group-hover:text-[#CBD5E1] transition-colors">
                Math Speed
              </h2>
              <p className="text-[#CBD5E1]">
                Solve 5 addition problems in 5 seconds each
              </p>
            </div>
          </Link>

          {/* Mind Speed Racer */}
          <Link href="/brain-test/racing">
            <div className="card-testmate p-8 hover:shadow-glow-blue transition-all cursor-pointer group">
              <div className="text-4xl mb-4">🚴</div>
              <h2 className="text-2xl font-bold mb-2 text-[#4F7BFE] group-hover:text-[#CBD5E1] transition-colors">
                Mind Speed Racer
              </h2>
              <p className="text-[#CBD5E1]">
                Race for 30 seconds, avoid bikes, maintain speed
              </p>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <Link href="/brain-test">
            <button className="bg-[#4F7BFE] hover:bg-[#A855F7] text-white font-bold py-4 px-8 rounded-lg transition-all shadow-glow-blue hover:shadow-glow-purple">
              Start Full Brain Test
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
