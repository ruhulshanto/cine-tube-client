import { HeroSection } from "@/components/shared/HeroSection";
import { DiscoverySection } from "./DiscoverySection";
import { HomeContentRails } from "./HomeContentRails";
import { FeaturesSection } from "./FeaturesSection";
import { StatsSection } from "./StatsSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FAQSection } from "./FAQSection";
import { CTASection } from "./CTASection";
import type { Movie } from "@/types/movie.types";

interface HomePageProps {
  billboardMovie?: Movie | null;
  trendingMovies: Movie[];
  featuredMovies: Movie[];
  topRatedMovies: Movie[];
  newMovies: Movie[];
  trendingLoading?: boolean;
  featuredLoading?: boolean;
  topRatedLoading?: boolean;
  newLoading?: boolean;
  stats: {
    totalMovies?: number;
    activeUsers?: number;
    reviewsCount?: number;
    subscriptionUsers?: number;
  };
}

export default function HomePage({
  billboardMovie,
  trendingMovies,
  featuredMovies,
  topRatedMovies,
  newMovies,
  trendingLoading,
  featuredLoading,
  topRatedLoading,
  newLoading,
  stats,
}: HomePageProps) {
  // Hero Movie Orchestration Logic
  const allAvailable = [
    ...(billboardMovie ? [billboardMovie] : []),
    ...featuredMovies,
    ...trendingMovies,
    ...topRatedMovies,
    ...newMovies
  ];

  // 1. Deduplicate by slug to ensure professional variety
  const uniquePool = Array.from(new Map(allAvailable.map(m => [m.slug, m])).values());

  // 2. Identify specific requested movies
  const spider = uniquePool.find(m => m.title.toLowerCase().includes("spider"));
  const narutoGhost = uniquePool.find(m => m.title.toLowerCase().includes("naruto") && m.title.toLowerCase().includes("ghost"));
  const naruto = uniquePool.find(m => m.title.toLowerCase().includes("naruto"));
  const yourName = uniquePool.find(m => m.title.toLowerCase().includes("your name"));

  // 3. Filter out Shang-Chi, Joker, Superman and the manually picked ones to avoid repetition
  const filteredOthers = uniquePool.filter(m => 
    m.slug !== spider?.slug && 
    m.slug !== narutoGhost?.slug &&
    m.slug !== naruto?.slug && 
    m.slug !== yourName?.slug &&
    !m.title.toLowerCase().includes("shang-chi") &&
    !m.title.toLowerCase().includes("joker") &&
    !m.title.toLowerCase().includes("superman")
  );

  // 4. Assemble the final 4-movie hero rotation in the requested order
  const finalHeroMovies = [
    spider || filteredOthers[0], // 1st: Spider-man
    narutoGhost || naruto || filteredOthers[0], // 2nd: Naruto: Ghost of the Uchiha (replaces Superman)
    yourName || filteredOthers[1] || filteredOthers[0], // 3rd: Your Name
    filteredOthers[2] || filteredOthers[1] // 4th: Variety
  ].filter(Boolean).slice(0, 4);

  return (
    <div className="bg-[#0b0b0b] text-white">
      <HeroSection movies={finalHeroMovies} />

      <div className="relative z-20 mt-0 space-y-16">
        <DiscoverySection
          trendingMovies={trendingMovies}
          featuredMovies={featuredMovies}
          topRatedMovies={topRatedMovies}
          newMovies={newMovies}
        />

        <HomeContentRails
          trendingMovies={trendingMovies}
          featuredMovies={featuredMovies}
          topRatedMovies={topRatedMovies}
          newMovies={newMovies}
          trendingLoading={trendingLoading}
          featuredLoading={featuredLoading}
          topRatedLoading={topRatedLoading}
          newLoading={newLoading}
        />

        <FeaturesSection />
        <StatsSection {...stats} />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </div>
    </div>
  );
}
