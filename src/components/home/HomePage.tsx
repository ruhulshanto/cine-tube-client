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
  return (
    <div className="bg-[#0b0b0b] text-white">
      <HeroSection movie={billboardMovie} />

      <div className="relative z-20 -mt-24 space-y-16">
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
