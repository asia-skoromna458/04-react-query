import axios from "axios";
import type { MoviesResponse } from "../types/movie";

export default async function fetchMovies(
  searchQuery: string,
  page: number = 1
): Promise<MoviesResponse> {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          query: searchQuery,
          page,
        },
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch {
    return {
      page: 1,
      total_pages: 1,
      results: [],
    };
  }
}
