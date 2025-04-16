import { getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ReactStars from "react-stars";
import { moviesRef } from "../firebase/firebase";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { fetchMovies,fetchMovies2 } from "../utils/apiService";
import { useParams } from "react-router-dom";
import Loader from "./GlobalComponents/Loader";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import TopPicksofTheWeek from "./LandingPage/TopPicksofTheWeek";
import { format } from "date-fns";
import poster_thumbnail from "../assets/poster_thumbnail.png";

const Cards = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const { filter } = useParams();
  const { lang } = useParams();
  const location = useLocation();
  // useEffect(() => {
    
    const getMovies = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 45); // Subtract 7 days
  
      // Format the dates to YYYY-MM-DD format (required by TMDB)
      const todayFormatted = today.toISOString().split('T')[0];
      const lastWeekFormatted = lastWeek.toISOString().split('T')[0];
      // const today = new Date();
      // const todayFormatted = today.toISOString().split("T")[0];
      //Bollywood Section
      const all = fetchMovies2({
        // api_key: process.env.REACT_APP_TMDB_API_KEY,
    language: "en-US",          // Hindi language results
    withOriginCountry: "IN",  // Only Indian movies (Bollywood)
    withOriginalLanguage: "hi", // Only Hindi-language movies
    sortBy: "primary_release_date.desc", // Get trending movies first
    // include_adult: false,       // Exclude adult content
    // primaryReleaseDateGte: lastWeekFormatted, // Start date (Modify as needed)
    primaryReleaseDateLte: todayFormatted, // End date (Modify as needed)
    withReleaseType: 3,       // Theatrical releases only
    region: "IN",               // Ensures relevance to Indian theaters
    page: page      
      });
      const popular = fetchMovies2({
        language: "en-US", // Hindi language // Sort by popularity
        timeWindow:"day",
  // filter: "trending/movie/day", // Fetch trending movies of the week
  page: page, // Maintain pagination // Ensure Indian movies
  withOriginCountry:"IN",
        withWatchProviders: "8|9|119|337", // Netflix, Prime Video, Hotstar, Zee5
        watchRegion: "IN",
      });
      const topRated = fetchMovies({
        page: page,
        language: "hi-IN",
        region: "IN",
        sortBy: "vote_average.desc", // Top-rated
        withOriginalLanguage: "hi",
      });
      const [upcomingMovies, upcomingTv] = await Promise.all([
        fetchMovies({
          language: "en-US",
          region: "IN",
          sortBy: "release_date.asc",
          primaryReleaseDate: todayFormatted,
          withOriginalLanguage: "hi",
          filter: "discover/movie",
          page: page,
          withOriginCountry: "IN",
          withWatchProviders: "8|9|119|337",
          watchRegion: "IN",
        }),
        fetchMovies2({
          language: "en-US",
          region: "IN",
          sortBy: "first_air_date.asc",
          firstAirDateGte: todayFormatted,
          withOriginalLanguage: "hi",
          filter: "discover/tv",
          page: page,
          withOriginCountry: "IN",
          withWatchProviders: "8|9|119|337", // Netflix, Prime Video, Hotstar, Zee5
          
        }),
      ]);

      // Extract results
      // const movies = upcomingMovies?.results || [];
      // const tvShows = upcomingTv?.results || [];
      // Extract results and add media type
      const movie = (upcomingMovies || []).map((movie) => ({
        ...movie,
        media_type: "movie", // Add a custom media type
      }));

      const tv = (upcomingTv || []).map((tv) => ({
        ...tv,
        media_type: "tv", // Add a custom media type
      }));

      // Merge and sort by date (use appropriate date field for sorting)
      const combinedResults = [...movie, ...tv].sort((a, b) => {
        const dateA = new Date(a.release_date || a.first_air_date);
        const dateB = new Date(b.release_date || b.first_air_date);
        return dateA - dateB; // Ascending order
      }).filter((item) => item.poster_path !== null);
      //Hollywood section starts
      const HollyAll = fetchMovies2({
        language: "en-US", // Hindi language // Sort by popularity
        timeWindow:"day",
  filter: "trending/movie/week", // Fetch trending movies of the week
  region:"US",
  withReleaseType: 3,
  page: page,
      });
      const HollyPopular = fetchMovies({
        page: page,
        language: "en-US", // Hindi language
        region: "US", // India region
        sortBy: "popularity.desc", // Popularity
        withOriginalLanguage: "en",
      });
      const HollyTopRated = fetchMovies({
        page: page,
        language: "en-US",
        region: "US",
        sortBy: "vote_average.desc", // Top-rated
        withOriginalLanguage: "en",
      });
      const HollyUpcoming = fetchMovies({
        language: "en-US",
        region: "US",
        sortBy: "release_date.asc", // Use the formatted date directly
        primaryReleaseDate: todayFormatted,
        withOriginalLanguage: "en",
        filter: "discover/movie",
        page: page,
        withOriginCountry: "US",
      }); //Bollywood section ends

      const HindiSeries = await axios.get(
        "https://api.themoviedb.org/3/discover/tv",
        {
          params: {
            api_key: process.env.REACT_APP_TMDB_API_KEY, // Your API Key
            language: "hi-IN", // Hindi interface
            with_original_language: "hi", // Filter for Hindi content
            sort_by: "popularity.desc", // Trending content
            // "first_air_date.gte": "2024-01-01", // Shows from the last year
            with_watch_providers: "8|9|119|337", // OTT platforms: Netflix, Amazon Prime, Hotstar, JioCinema
            watch_region: "IN", // Limit to Indian region
            page: page, // Pagination
          },
        }
      ); //Bollywood section ends

      // Wait for all movie data to be fetched
      const [
        allMovies,
        popularMoviesData,
        topRatedMoviesData,
        // upcomingMoviesData,
        HindiSeriesData,
      ] = await Promise.all([all, popular, topRated, HindiSeries]);
      const [
        HollyAllMovies,
        HollyPopularMoviesData,
        HollyTopRatedMoviesData,
        HollyUpcomingMoviesData,
      ] = await Promise.all([
        HollyAll,
        HollyPopular,
        HollyTopRated,
        HollyUpcoming,
      ]);

      if (lang === "hi") {
        if (filter === "upcoming") {
          setData(combinedResults);
        } else if (filter === "popular") {
          setData(popularMoviesData);
        } else if (filter === "all") {
          setData(allMovies);
        } else if (filter === "tv-shows") {
          setData(HindiSeriesData.data.results);
        } else {
          setData(topRatedMoviesData);
        }
      } else if (lang === "en") {
        if (filter === "upcoming") {
          setData(HollyUpcomingMoviesData);
        } else if (filter === "popular") {
          setData(HollyPopularMoviesData);
        } else if (filter === "all") {
          setData(HollyAllMovies);
        } else {
          setData(HollyTopRatedMoviesData);
        }
      }
      setLoading(false); // Stop loading once data is fetched
    } catch (error) {
      console.error("Error fetching movies", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, [page, filter, location]);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleNextPage = () => {
    if (!data || data.length === 0) {
    return; // Prevent navigation if no valid data
  }
    setPage((prevPage) => prevPage + 1)}; // Increment the page
  const handlePreviousPage = () =>
    setPage((prevPage) => Math.max(prevPage - 1, 1)); // Decrement the page, minimum is 1

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col max-sm:mt-8">
      <div className={`relative  w-full px-36  max-sm:px-2 pt-8 items-center flex justify-between ${filter === "tv-shows"? "hidden" :""}`}>
        <h1
          onClick={() => setDropdownVisible(!dropdownVisible)}
          className="dropdown-container text-base cursor-pointer bg-[#DD003F] px-[0.5rem] py-[0.1rem] text-center rounded-full"
        >
          <p className="flex items-center">
            <p>{lang === "en" ? "Hollywood" : "Bollywood"}</p>{" "}
            <MdKeyboardArrowDown />
          </p>
        </h1>
        {/* Dropdown Menu */}

        {dropdownVisible && (
          <div className="absolute max-sm:w-max text-base left-36 max-sm:left-2 max-sm:flex max-sm:justify-start max-sm:right-2 mt-16 bg-[#474242] hover:bg-[#DD003F] shadow-lg rounded-full z-50">
            <ul className="pl-[0.5rem] pr-[1.2rem] max-sm:pr-[1.2rem] py-[0.1rem] ">
              {lang === "en" ? (
                <Link to={`/hi/all`}>
                  <li className=" cursor-pointer">Bollywood</li>
                </Link>
              ) : (
                <Link to={`/en/all`}>
                  <li className="  cursor-pointer">Hollywood</li>
                </Link>
              )}
            </ul>
          </div>
        )}
        {lang === "hi" ? (
          <div className="flex flex-row gap-4 max-sm:gap-2 justify-end pr-2 max-sm:mt-0 max-sm:pr-0 max-sm:justify-center">
            <Link to={`/hi/all`}>
              {filter === "all" ? (
                <p className="text-yellow-400">All</p>
              ) : (
                <p>All</p>
              )}
            </Link>
            <Link to={`/hi/top_rated`}>
              {filter === "top_rated" ? (
                <p className="text-yellow-400">Top Rated</p>
              ) : (
                <p>Top Rated</p>
              )}
            </Link>
            <Link to={`/hi/popular`}>
              {filter === "popular" ? (
                <p className="text-yellow-400">Popular</p>
              ) : (
                <p>Popular</p>
              )}
            </Link>
            <Link to={`/hi/upcoming`}>
              {filter === "upcoming" ? (
                <p className="text-yellow-400">Upcoming</p>
              ) : (
                <p>Upcoming</p>
              )}
            </Link>
          </div>
        ) : (
          <div className="flex flex-row gap-4 max-sm:gap-2 justify-end pr-2 max-sm:mt-0 max-sm:pr-0 max-sm:justify-center">
            <Link to={`/en/all`}>
              {filter === "all" ? (
                <p className="text-yellow-400">All</p>
              ) : (
                <p>All</p>
              )}
            </Link>
            <Link to={`/en/top_rated`}>
              {filter === "top_rated" ? (
                <p className="text-yellow-400">Top Rated</p>
              ) : (
                <p>Top Rated</p>
              )}
            </Link>
            <Link to={`/en/popular`}>
              {filter === "popular" ? (
                <p className="text-yellow-400">Popular</p>
              ) : (
                <p>Popular</p>
              )}
            </Link>
            <Link to={`/en/upcoming`}>
              {filter === "upcoming" ? (
                <p className="text-yellow-400">Upcoming</p>
              ) : (
                <p>Upcoming</p>
              )}
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center px-2 mt-2 md:mr-20 md:ml-20 ">
        {loading ? (
          <Loader />
        ) : (
          data.map((e, i) => {
            return (
              <Link
                to={`/chitrapat/${e.media_type === "tv" ? "tv" : "movie"}/${
                  e.id
                }`}
              >
                <div
                  key={i}
                  className="p-2 w-44 md:w-56  hover:-translate-y-1 font-semibold mt-5 transition-all duration-200 flex flex-wrap justify-between"
                >
                  {e.poster_path ? (
                    <img
                      className="plp-poster object-cover"
                      src={`https://image.tmdb.org/t/p/w500/${e.poster_path}`}
                      alt="Movie Poster"
                    />
                  ) : (
                    <img className="plp-poster" src={poster_thumbnail} alt="Movie Poster"/>
                  )}
                  <div className="flex flex-col items-start justify-between opacity-70 text-xs w-44 md:w-56">
                    <h1 className="mt-2 break-all md:break-words text-sm font-normal">
                      {e.media_type === "tv" ? e.name : e.title}
                    </h1>
                    <div className="w-full flex justify-between items-center">
                      {filter === "upcoming" ? (
                        <div className="w-full flex justify-between items-center">
                          <span>
                            <span className="text-yellow-500">
                              To Be Released on{" "}
                            </span>
                          </span>
                          <span>
                            {e?.media_type === "tv"
                                            ? e?.first_air_date
                                              ? format(new Date(e.first_air_date), "dd MMM yyyy")
                                              : "Not Available"
                                            : e?.release_date
                                              ? format(new Date(e.release_date), "dd MMM yyyy")
                                              : "Not Available"}
                          </span>
                        </div>
                      ) : (
                        <div className="w-full flex justify-between items-center">
                          <span>
                            <span className="text-yellow-500">★</span>
                            <span className="text-base">
                              {e.vote_average.toFixed(1)}
                            </span>
                          </span>
                          <span>{new Date().getFullYear(e.release_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
        <div className="w-full px-8 flex justify-between my-5">
          <button
            onClick={handlePreviousPage}
            className="flex items-center"
            disabled={page === 1}
          >
            <span>
              <MdOutlineKeyboardArrowLeft />
            </span>
            <span>PREV</span>
          </button>
          <p className={`${!data || data.length === 0 ? "hidden" : ""}`}>Page : {page}</p>
          <button onClick={handleNextPage} className={`flex items-center ${!data || data.length === 0 ? "hidden" : ""}`}>
            <span >NEXT</span>
            <span>
              <MdOutlineKeyboardArrowRight />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
