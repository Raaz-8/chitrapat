import axios from "axios";

// Base URL for the API
const API_BASE_URL = "https://api.themoviedb.org/3/";

// Function to fetch movies
export async function fetchMovies({ page = 1, language = "hi-IN", region = "IN", filter = "discover/movie", sortBy = "popularity.desc", primaryReleaseDate = "", withOriginalLanguage = "", withOriginCountry = "" }) {
  try {
    const params = {
      api_key: process.env.REACT_APP_TMDB_API_KEY, // API key from environment variables
      language,
      region,
      sort_by: sortBy, // Sorting criteria, e.g., popularity or top-rated
      page,
    };

    // Add additional filters to params based on the query
    if (primaryReleaseDate) {
      params["primary_release_date.gte"] = primaryReleaseDate;
  }    if (withOriginalLanguage) params.with_original_language = withOriginalLanguage;
    if (withOriginCountry) params.with_origin_country = withOriginCountry;

    const response = await axios.get(`${API_BASE_URL}${filter}`, { params });

    if (response.status === 200) {
      return response.data.results; // Return the array of movies or TV shows
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching movie data:", error.message);
    throw error; // Rethrow the error for the caller to handle
  }
}

export async function fetchMovies2({ page = 1, language = "hi-IN",region="IN",sortBy="",withReleaseType="",filter = "discover/movie", withOriginalLanguage = "", withOriginCountry = "",timeWindow="",withWatchProviders="",watchRegion="",primaryReleaseDateGte="",primaryReleaseDateLte="" ,firstAirDateGte=""}) {
  try {
    const params = {
      api_key: process.env.REACT_APP_TMDB_API_KEY, // API key from environment variables
      language, // Sorting criteria, e.g., popularity or top-rated
      region,
      page,
    };

    // Add additional filters to params based on the query
    if (primaryReleaseDateGte) {
      params["primary_release_date.gte"] = primaryReleaseDateGte;
  }    
  if (primaryReleaseDateLte) {
    params["primary_release_date.lte"] = primaryReleaseDateLte;
}
if (firstAirDateGte) {
  params["first_air_date.gte"] = firstAirDateGte;
}    
    if (withOriginalLanguage) params.with_original_language = withOriginalLanguage;
    if (withOriginCountry) params.with_origin_country = withOriginCountry;
    if (timeWindow) params.time_window = timeWindow;
    if (withWatchProviders) params.with_watch_providers = withWatchProviders;
    if (watchRegion) params.watch_region = watchRegion;
    if (withReleaseType) params.with_release_type = withReleaseType;
    if (sortBy) params.sort_by = sortBy;



    const response = await axios.get(`${API_BASE_URL}${filter}`, { params });

    if (response.status === 200) {
      return response.data.results; // Return the array of movies or TV shows
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching movie data:", error.message);
    throw error; // Rethrow the error for the caller to handle
  }
}
