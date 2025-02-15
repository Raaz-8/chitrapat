import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HandleResize from "./HandleResize";
import poster_thumbnail from "../../assets/poster_thumbnail.png";

function WebSeries() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [WebSeries, setWebSeries] = useState([]);
  const isMobile = HandleResize();
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Fetch top picks, popular, and upcoming movies
        const WebSeriesRes = await axios.get(
          "https://api.themoviedb.org/3/discover/tv",
          {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY, // Your API Key
              language: "en-US", // Hindi interface
              with_original_language: "hi", // Filter for Hindi content
              sort_by: "popularity.desc", // Trending content
              "first_air_date.gte": "2024-01-01", // Shows from the last year
              with_watch_providers: "8|9|119|337", // OTT platforms: Netflix, Amazon Prime, Hotstar, JioCinema
              watch_region: "IN", // Limit to Indian region
              page: 1, // Pagination
            },
          }
        );

        // Set state for each category
        const movieSlice = isMobile
          ? WebSeriesRes.data.results.slice(0, 3)
          : WebSeriesRes.data.results.slice(0, 7);

        setWebSeries(movieSlice);

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
    navigate(`/chitrapat/tv/${movieId}`);
  };

  return (
    <section className="section mb-12 px-24 w-full max-sm:w-full max-sm:px-4">
      {/* Top Picks Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-2">Hindi Web Series</h2>
        <button
          onClick={() => navigate("/hi/tv-shows")}
          className="mt-4 text-sm hover:underline mb-4"
        >
          View All
        </button>
      </div>
      <div className="flex justify-start gap-4">
        {WebSeries.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleMovieClick(movie.id)}
            className="cursor-pointer"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : poster_thumbnail
              }
              alt={movie.title}
              className="w-full h-auto"
            />
            <h3 className="text-left text-xs mt-2 relative text-yellow-50">
              {movie.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WebSeries;
