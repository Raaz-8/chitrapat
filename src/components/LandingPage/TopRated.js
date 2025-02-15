import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick"; // Import React Slick for carousel
import { FaStar } from "react-icons/fa";

function TopRated() {
  const navigate = useNavigate();

  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 45); // Subtract 7 days

    // Format the dates to YYYY-MM-DD format (required by TMDB)
    const todayFormatted = today.toISOString().split('T')[0];
    const lastWeekFormatted = lastWeek.toISOString().split('T')[0];
      try {
        // Fetch top rated movies
        const topRatedResponse = await axios.get(
          "https://api.themoviedb.org/3/discover/movie", // Discover movies endpoint
          {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY, // API Key
              language: "en-US", // Localized to Hindi
              page: '1', // Fetch the first page
              with_original_language: "hi", // Hindi movies
              with_origin_country: "IN", // Movies from India (Bollywood)
              sort_by: "popularity.desc", // Sort by popularity
              'primary_release_date.gte': lastWeekFormatted, // Movies released from 7 days ago
              'primary_release_date.lte': todayFormatted, // Movies released until today
              with_watch_providers: "8|9|119|337",
              page_size:40,
              with_release_type:3,
              region:"IN",
            },
          }
        );

        const bollywoodMovies = topRatedResponse.data.results.filter(movie => {
          return movie.backdrop_path !== null ;
        });

        console.log(bollywoodMovies);

        setTopRatedMovies(bollywoodMovies.slice(0, 10));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie data:", error.message);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const settings = {
    centerMode: true, // Enables center slide
    centerPadding: "30px", // Adjust padding around the center slide
    slidesToShow: 3, // Number of slides visible
    autoplay: true, // Enables autoplay
    autoplaySpeed: 3000, // Autoplay interval
    infinite: true, // Infinite scrolling
    speed: 500, // Transition speed
    arrows: false, // Show navigation arrows
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1, // Show 1 slide on smaller screens
          centerPadding: "15px",
        },
      },
    ],
  };

  // Movie click handler
  const handleMovieClick = (movieId) => {
    navigate(`/chitrapat/movie/${movieId}`);
  };

  return (
    <div>
      {/* Full-Screen Section for Top Rated Movies */}
      <section className="top-rated-section -mt-14 w-full max-sm:mt-2">
        <Slider {...settings}>
          {topRatedMovies.map((movie) => (
            <div
              key={movie.id}
              className="px-4 transition-transform duration-300 ease-in-out"
            >
              <div className="slick-slide-inner">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  onClick={() => handleMovieClick(movie.id)}
                  alt={movie.title}
                  className="p-0 m-0 gap-0 shadow-lg cursor-pointer"
                />
                <h3 
                onClick={() => handleMovieClick(movie.id)} className="flex justify-between text-center items-center cursor-pointer"><div className="text-2xl">{movie.title}</div><div className="text-sm"><span className="text-lg"><span className="text-yellow-500">★ </span>{movie.vote_average.toFixed(1)}</span>/10</div></h3>
              </div>
            </div>
          ))}
        </Slider>
      </section>
    </div>
  );
}

export default TopRated;
