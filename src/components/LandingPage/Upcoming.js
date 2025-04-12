import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HandleResize from "./HandleResize";
import poster_thumbnail from "../../assets/poster_thumbnail.png";

function Upcoming() {
  const navigate = useNavigate();
  const [upcomingContent, setUpcomingContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = HandleResize();

  useEffect(() => {
    const fetchUpcomingContent = async () => {
      setLoading(true);
      try {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const todayFormatted = today.toISOString().split("T")[0];

        const movieResponse = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY,
              page: 1,
              language: "en-US",
              region: "IN",
              sort_by: "release_date.asc",
              "primary_release_date.gte": todayFormatted,
              with_original_language: "hi",
              with_origin_country: "IN",
            },
          }
        );

        const tvResponse = await axios.get(
          "https://api.themoviedb.org/3/discover/tv",
          {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY,
              page: 1,
              language: "en-US",
              sort_by: "first_air_date.asc",
              "first_air_date.gte": todayFormatted,
              with_original_language: "hi",
              with_origin_country: "IN",
            },
          }
        );
        
        // const combinedResults = ;
        const combinedResults = [...movieResponse.data.results, ...tvResponse.data.results].sort((a, b) => {
          const dateA = new Date(a.release_date || a.first_air_date);
          const dateB = new Date(b.release_date || b.first_air_date);
          return dateA - dateB; // Ascending order
        }).filter((item) => item.poster_path !== null);
        const contentSlice = isMobile ? combinedResults.slice(0, 3) : combinedResults.slice(0, 7);
        setUpcomingContent(contentSlice);
      } catch (error) {
        console.error("Error fetching upcoming content:", error.message);
      }
      setLoading(false);
    };

    fetchUpcomingContent();
  }, [isMobile]);

  const handleContentClick = (id, type) => {
    navigate(`/chitrapat/${type}/${id}`);
  };

  return (
    <section className="section mb-12 px-24 w-full max-sm:w-full max-sm:px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-2">Upcoming Bollywood Movies & Series</h2>
        <button
          onClick={() => navigate("/hi/upcoming")}
          className="mt-4 text-sm hover:underline mb-4"
        >
          View All
        </button>
      </div>
      <div className="flex justify-start gap-4">
        {upcomingContent.map((content) => (
          <div
            key={content.id}
            onClick={() => handleContentClick(content.id, content.media_type || "movie")}
            className="cursor-pointer text-xs"
          >
            <img
              src={content.poster_path ? `https://image.tmdb.org/t/p/w500${content.poster_path}` : poster_thumbnail}
              alt={content.title || content.name}
              className="w-full h-auto"
            />
            <h3 className="text-left mt-2">{content.title || content.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Upcoming;
