import { Movie } from "@/types/movie.types";

interface SearchResult {
  item: Movie;
  score: number;
}

/**
 * Calculate Levenshtein distance (for typo tolerance)
 * Lower distance = better match
 */
function levenshteinDistance(a: string, b: string): number {
  const aLen = a.length;
  const bLen = b.length;
  const dp: number[][] = Array.from({ length: aLen + 1 }, () =>
    Array(bLen + 1).fill(0),
  );

  for (let i = 0; i <= aLen; i++) dp[i][0] = i;
  for (let j = 0; j <= bLen; j++) dp[0][j] = j;

  for (let i = 1; i <= aLen; i++) {
    for (let j = 1; j <= bLen; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[aLen][bLen];
}

/**
 * Calculate similarity score between two strings (0-1)
 * Based on Levenshtein distance
 */
function calculateSimilarity(query: string, text: string): number {
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();

  // Exact match
  if (lowerText === lowerQuery) return 1;

  // Starts with match (higher score)
  if (lowerText.startsWith(lowerQuery)) return 0.95;

  // Contains exact substring (high score)
  if (lowerText.includes(lowerQuery)) return 0.8;

  // Check for multiple word match (e.g., "spider man" against "Spider-Man: Title")
  const queryWords = lowerQuery.split(/\s+/);
  const textWords = lowerText.split(/[\s:\-.,]/);
  const matchedWords = queryWords.filter((qWord) =>
    textWords.some((tWord) => tWord.startsWith(qWord)),
  );

  if (matchedWords.length > 0) {
    return 0.6 + (matchedWords.length / queryWords.length) * 0.2;
  }

  // Fuzzy match using Levenshtein distance
  const distance = levenshteinDistance(lowerQuery, lowerText);
  const maxLength = Math.max(lowerQuery.length, lowerText.length);
  const similarity = 1 - distance / maxLength;

  return similarity > 0.4 ? similarity : 0;
}

/**
 * Fuzzy search with typo tolerance and multiple field support
 */
export function fuzzySearch(query: string, movies: Movie[]): Movie[] {
  if (!query.trim()) return [];
  if (!Array.isArray(movies) || movies.length === 0) return [];

  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  movies.forEach((movie) => {
    let bestScore = 0;

    // Search in title (highest weight)
    const titleScore = calculateSimilarity(lowerQuery, movie.title);
    bestScore = Math.max(bestScore, titleScore * 1);

    // Search in synopsis (medium weight)
    const synopsisScore = calculateSimilarity(lowerQuery, movie.synopsis);
    bestScore = Math.max(bestScore, synopsisScore * 0.3);

    // Search in director (high weight)
    if (movie.director) {
      const directorScore = calculateSimilarity(lowerQuery, movie.director);
      bestScore = Math.max(bestScore, directorScore * 0.7);
    }

    // Search in cast (medium weight)
    const castScore = Math.max(
      ...(movie.cast || []).map((castMember) =>
        calculateSimilarity(lowerQuery, castMember),
      ),
      0,
    );
    bestScore = Math.max(bestScore, castScore * 0.4);

    // Search in genres (low weight)
    const genreScore = Math.max(
      ...(movie.genres || []).map((genre) =>
        calculateSimilarity(lowerQuery, genre),
      ),
      0,
    );
    bestScore = Math.max(bestScore, genreScore * 0.2);

    // Search in tags (low weight)
    const tagScore = Math.max(
      ...(movie.tags || []).map((tag) => calculateSimilarity(lowerQuery, tag)),
      0,
    );
    bestScore = Math.max(bestScore, tagScore * 0.2);

    if (bestScore > 0.3) {
      results.push({ item: movie, score: bestScore });
    }
  });

  // Sort by score (highest first)
  return results.sort((a, b) => b.score - a.score).map((r) => r.item);
}
