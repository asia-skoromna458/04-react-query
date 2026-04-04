import { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import fetchMovies from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import type { Movie, MoviesResponse } from "../../types/movie";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../ReactPaginate/ReactPaginate";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { data, isLoading, isError } = useQuery<MoviesResponse>({
    queryKey: ["movies", searchQuery, currentPage],
    queryFn: () => fetchMovies(searchQuery, currentPage),
    enabled: searchQuery.length > 0,
  });

  useEffect(() => {
    if (!isLoading && data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isLoading, data]);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  const handleSearch = async (newSearchQuery: string) => {
    setSearchQuery(newSearchQuery);
    setCurrentPage(1);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {data && (
        <Pagination
          totalPages={data.total_pages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

      {isLoading && <Loader />}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
      {!isLoading && data && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
      )}
      {isError && <ErrorMessage />}
    </>
  );
}
