import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HandleResize from "./HandleResize";
// import config from useAdminConfig;
import useAdminConfig from "../Admin/useAdminConfig";

function Popular() {
  const navigate = useNavigate();
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = HandleResize();
  const config = useAdminConfig();


  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const popularResponse = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            params: {
              'api_key': process.env.REACT_APP_TMDB_API_KEY,
              'language': "en-US", // Hindi language
        'region': "US", // India region
        'sort_by': "popularity.desc", // Popularity
        'page':1,
        'with_origin_country': "IN",
        with_watch_providers: "8|9|119|337", // Netflix, Prime Video, Hotstar, Zee5
    watch_region: "IN",

            },
          }
        );

        // Set state for each category
        const movieSlice = isMobile
        ?popularResponse.data.results.slice(0, 3)
        :popularResponse.data.results.slice(0, 5);

        setPopularMovies(movieSlice);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie data:", error.message);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [isMobile]);

  if (!config) return <p>Loading config...</p>; // or show a skeleton loader
  const { sectionHeadings } = config || {};

  // Movie click handler
  const handleMovieClick = (movieId) => {
    navigate(`/chitrapat/movie/${movieId}`);
  };

  return (
    <section className="section mb-12 w-4/6 max-sm:w-full max-sm:px-4">
      {/* Popular Section */}
      
      <div className="flex justify-between items-center bg-[#DD003F] mb-4 max-sm:pl-2 pl-24">
        <h2 className="text-xl font-semibold mb-1">{sectionHeadings.popularBollywoodMovies}</h2>
        <button
          onClick={() => navigate("/hi/popular")}
          className="mt-4 text-sm hover:underline mb-4 pr-2"
        >
          View All
        </button>
      </div>
      <div className="flex justify-start gap-4 max-sm:pl-0 pl-24">
        {popularMovies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleMovieClick(movie.id)}
            className="cursor-pointer text-xs"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto"
            />
            <h3 className="text-left mt-2">{movie.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Popular;
