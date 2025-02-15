import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HandleResize from "./HandleResize";

function TopPicksofTheWeek() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [topPicks, setTopPicks] = useState([]);
  const isMobile = HandleResize();
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 15); // Subtract 7 days

    // Format the dates to YYYY-MM-DD format (required by TMDB)
    const todayFormatted = today.toISOString().split('T')[0];
    const lastWeekFormatted = lastWeek.toISOString().split('T')[0];
      try {
        // Fetch top rated movies
        const topPicksResponse = await axios.get(
          "https://api.themoviedb.org/3/discover/movie", // Discover movies endpoint
          {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY, // API Key
              language: "en-US", // Localized to Hindi
              page: 1, // Fetch the first page
              with_original_language: "hi", // Hindi movies
              // with_origin_country: "IN", // Movies from India (Bollywood)
              sort_by: "popularity.desc", // Sort by popularity
              'primary_release_date.gte': lastWeekFormatted, // Movies released from 7 days ago
              'primary_release_date.lte': todayFormatted, // Movies released until today
              with_watch_providers: "8|9|119|337",
              page_size:40,
              // with_release_type:3,
              // region:"IN",
            },
          }
        );
        const bollywoodMovies = topPicksResponse.data.results.filter(movie => {
          return movie.poster_path !== null ;
        });
        // Set state for each category
        const movieSlice = isMobile
          ?bollywoodMovies.slice(0, 3)
          :bollywoodMovies.slice(0, 5);

          setTopPicks(movieSlice);

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
    <section className="section mb-12 pl-24 w-4/6 max-sm:w-full max-sm:px-4">
      {/* Top Picks Section */}
      <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold mb-4">Trending Today</h2> 
      <button
      onClick={() => navigate("/hi/all")}
      className="mt-4 text-sm hover:underline mb-4"
    >
      View All
    </button></div>
      <div className="flex justify-start gap-4">
        {topPicks.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleMovieClick(movie.id)}
            className="cursor-pointer"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-[15rem] max-sm:h-[10rem]"
            />
            <h3 className="text-center text-xs mt-2 absolute">{movie.title}</h3>
          </div>
        ))}
      </div>
      
    </section>
  );
}

export default TopPicksofTheWeek;
