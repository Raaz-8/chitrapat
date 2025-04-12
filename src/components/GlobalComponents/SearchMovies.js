import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const SearchMovies = () => {
  const [query, setQuery] = useState("");  // Store the search query
  const [movies, setMovies] = useState([]); // Store the search results
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error state
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const searchMovies = async () => {
      if (!query) return; // Don't make a request if the query is empty

      setLoading(true);
      try {
        const response = await axios.get("https://api.themoviedb.org/3/search/multi", {
          params: {
            api_key: process.env.REACT_APP_TMDB_API_KEY,
            query: query, // User input from the search bar
        language: "en-US", // Hindi content preference
        include_adult: false, // Exclude adult content
        region: "IN", // Prioritize Indian content
          },
        });

        if (response.status === 200) {
          setMovies(response.data.results.slice(0, 8)); // Set the search results
        }
      } catch (error) {
        setError("Failed to fetch search results.");
        console.error("Error fetching search data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    searchMovies(); // Trigger the API call when the query changes
  }, [query]); // Run the effect when the query changes

  const handleChange = (e) => {
    setQuery(e.target.value);  // Update the query as the user types
    
  };

  const handleMovieClick = (movieId,media_type) => {
    setQuery("");
    navigate(`/chitrapat/${media_type}/${movieId}`); // Redirect to the movie detail page using movie ID
  };

  return (
    <div className="flex justify-center">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for a Movie, Series, TV show"
        // style={{ padding: "10px", width: "300px", color:"black" }}
        className="search-bar p-3 focus:outline-none h-8 text-sm bg-[#47424281] max-sm:absolute max-sm:w-3/4 max-sm:mx-10"
      />

      
      {error && <p>{error}</p>}

      <ul className="search-results text-sm/snug px-3 py-2 mt-8 max-sm:w-[21rem] max-sm:left-0 max-sm:ml-10">
      
        {movies.length > 0 && query && (
          movies.map((movie) => (
            <li 
              key={movie.id} 
            //   style={{ cursor: "pointer", padding: "5px 0" }}
              className="cursor-pointer pl-3 ml-[0rem] py-1 text-[#FFD7D1] bg-[#474242] max-sm:w-inherit max-sm:left-0"
              onClick={() => handleMovieClick(movie.id,movie.media_type)}  // When clicked, go to PDP
            >

            {loading ? <p>Loading...</p> : <p>{movie.media_type==="movie"?movie.title:movie.name}</p>}

            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SearchMovies;
