import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HandleResize from "./HandleResize";

function HollywoodMovies() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [HollywoodMovies, setHollywoodMovies] = useState([]);
  const isMobile = HandleResize();
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Fetch top picks, popular, and upcoming movies
        const HollywoodMoviesRes = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY,
              region: "US", // Region for Hollywood (United States)
      sort_by: "popularity.desc", // Sort by popularity
      language: "en-US", // English language
      page: 1,
            },
          }
        );

        // Set state for each category
        const movieSlice = isMobile
          ? HollywoodMoviesRes.data.results.slice(0, 3)
          : HollywoodMoviesRes.data.results.slice(0, 7);

          setHollywoodMovies(movieSlice);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie data:", error.message);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [isMobile]);

  // Movie click handler
  const handleMovieClick = (movieId) => {
    navigate(`/chitrapat/movie/${movieId}`);
  };

  return (
    <section className="section mb-12 px-24 w-full max-sm:w-full max-sm:px-4">
      {/* Top Picks Section */}
      <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold mb-2">Popular Hollywood Movies</h2> 
      <p className="h-[1px] w-3/4 max-sm:w-1/4 bg-red-200 "></p>
      <button
      onClick={() => navigate("/en/hollywood")}
      className="mt-4 text-sm hover:underline mb-4"
    >
      View All
    </button></div>
      <div className="flex justify-start gap-4">
        {HollywoodMovies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleMovieClick(movie.id)}
            className="cursor-pointer"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto"
            />
            <h3 className="text-center text-xs mt-2 absolute">{movie.title}</h3>
          </div>
        ))}
      </div>
      
    </section>
  );
}

export default HollywoodMovies;
