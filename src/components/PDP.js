import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "./GlobalComponents/Loader";
import ReactStars from "react-stars";
import HandleResize from "./LandingPage/HandleResize";
import { FaUser } from "react-icons/fa6";
import poster_thumbnail from "../assets/poster_thumbnail.png";
import ReviewData from "./ReviewData";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, reviewDataRef } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { format } from "date-fns";
// import { reviewDataRef, db } from "../firebase/firebase";

const MovieDetails = () => {
  const { category, id } = useParams(); // Get the id from the URL params
  const navigate = useNavigate(); // Use the useNavigate hook
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [activeTab, setActiveTab] = useState("media"); // Default tab is "overview"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = HandleResize();
  const [reviews, setReviews] = useState("");
  const [director, setDirector] = useState("Loading...");
  const [writers, setWriters] = useState("Loading...");
  const [chitrapatRating, setChitrapatRating] = useState(0);
  const [reviewsData, setReviewsData] = useState([]);

  const fetchData = async (url, params = {}) => {
    try {
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      return null; // Return null instead of throwing an error
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id || !category) {
        setError("Invalid movie ID or category.");
        return;
      }

      try {
        setLoading(true);

        const apiKey = process.env.REACT_APP_TMDB_API_KEY;
        const baseURL = `https://api.themoviedb.org/3/${category}/${id}`;

        // Fetch all data concurrently
        const [
          movieData,
          creditsData,
          relatedMoviesData,
          photosData,
          videosData,
          reviewsData,
        ] = await Promise.allSettled([
          fetchData(baseURL, { api_key: apiKey, language: "en-US" }),
          fetchData(`${baseURL}/credits`, { api_key: apiKey }),
          fetchData(`${baseURL}/recommendations`, {
            api_key: apiKey,
            language: "en-US",
          }),
          fetchData(`${baseURL}/images`, { api_key: apiKey }),
          fetchData(`${baseURL}/videos`, { api_key: apiKey }),
          fetchData(`${baseURL}/reviews`, { api_key: apiKey }),
        ]);

        // Extract valid data or default values
        const movie = movieData.status === "fulfilled" ? movieData.value : null;
        const credits =
          creditsData.status === "fulfilled" ? creditsData.value : null;
        const relatedMovies =
          relatedMoviesData.status === "fulfilled"
            ? relatedMoviesData.value?.results || []
            : [];
        const photos =
          photosData.status === "fulfilled"
            ? photosData.value?.backdrops || []
            : [];
        const videos =
          videosData.status === "fulfilled"
            ? videosData.value?.results || []
            : [];
        const reviews =
          reviewsData.status === "fulfilled"
            ? reviewsData.value?.results || []
            : [];

        // Extract director and writers
        const crew = credits?.crew || [];
        const directorData = crew.find((member) => member.job === "Director");
        const writersData = crew.filter(
          (member) => member.job === "Writer" || member.job === "Story"
        );

        // Filter trailers and recaps
        const videoKeywords = ["trailer", "recap", "summary"];
        const filteredVideos = videos.filter((video) =>
          videoKeywords.some((keyword) =>
            video.name?.toLowerCase().includes(keyword)
          )
        );

        const sliceVal = isMobile ? 6 : 8;

        setMovie(movie);
        setDirector(directorData?.name || "Not Available");
        setWriters(
          writersData.length
            ? writersData.map((w) => w.name).join(", ")
            : "Not Available"
        );
        setCast(credits?.cast || []);
        setRelatedMovies(relatedMovies.slice(0, sliceVal));
        setPhotos(photos.slice(0, sliceVal));
        setVideos(filteredVideos);
        setReviews(reviews.slice(0, sliceVal - 3));

        // Fetch Chitrapat Ratings
        try {
          const reviewRef = collection(db, "review_data");
          const q = query(reviewRef, where("movie_id", "==", parseInt(id, 10)));
          const querySnapshot = await getDocs(q);

          let totalCount = 0;
          let totalRating = 0;

          querySnapshot.forEach((doc) => {
            totalCount += 1;
            totalRating += doc.data().rating || 0;
          });

          const averageRating = totalCount > 0 ? totalRating / totalCount : 0;
          setChitrapatRating(averageRating);
        } catch (ratingError) {
          console.error("Error fetching review data:", ratingError);
        }

      } catch (error) {
        console.error("Error fetching movie details:", error);
        setLoading(false);
        setError("Failed to fetch movie details.");
      }
    };
    
    fetchMovieDetails();
  }, [id, category]);
  useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false); // Stop loading after 3 seconds
      }, 1000);
  
      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }, []);

  useEffect(() => {
    // Retrieve movie data from localStorage
    const storedMovieData = localStorage.getItem("reviews");
    if (storedMovieData) {
      // Parse and set the data to state
      setReviews(JSON.parse(storedMovieData));
    }
  }, []);

  useEffect(() => {
    const movieDocRef = query(
      reviewDataRef,
      where("movie_id", "==", parseInt(id, 10))
    );

    const unsubscribe = onSnapshot(movieDocRef, (querySnapshot) => {
      setLoading(true); // Set loading to true before processing data
      const fetchedData = []; // Temporary array to hold the fetched data

      querySnapshot.forEach((doc) => {
        // Push the document data into the temporary array
        fetchedData.push(doc.data());
      });

      setReviewsData(fetchedData); // Update state with the fetched data
      setLoading(false); // Set loading to false after processing
      // localStorage.setItem("reviews", JSON.stringify(fetchedData)); // Store data in localStorage
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [id]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openImage = (image) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsOpen(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Movie click handler
  const handleMovieClick = (movieId) => {
    navigate(`/chitrapat/${category}/${movieId}`);
  };

  const genreColors = {
    Action: "bg-[#FF5733]", // Vibrant Red
    Adventure: "bg-[#FFC300]", // Bright Yellow
    Animation: "bg-[#5CD0FF]", // Light Blue
    Comedy: "bg-[#FF7F50]", // Coral
    Crime: "bg-[#A52A2A]", // Brown
    Documentary: "bg-[#6A5ACD]", // Slate Blue
    Drama: "bg-[#4682B4]", // Steel Blue
    Family: "bg-[#FFDAB9]", // Peach Puff
    Fantasy: "bg-[#9370DB]", // Medium Purple
    History: "bg-[#DAA520]", // Goldenrod
    Horror: "bg-[#B22222]", // Firebrick
    Music: "bg-[#20B2AA]", // Light Sea Green
    Mystery: "bg-[#4B0082]", // Indigo
    Romance: "bg-[#FF1493]", // Deep Pink
    ScienceFiction: "bg-[#2E8B57]", // Sea Green
    TVMovie: "bg-[#00CED1]", // Dark Turquoise
    Thriller: "bg-[#FF8C00]", // Dark Orange
    War: "bg-[#B8860B]", // Dark Goldenrod
    Western: "bg-[#D2691E]", // Chocolate
  };

  return (
    <div className="max-sm:px-8 max-sm:py-14 px-32 py-6 max-w-7xl mx-auto">
      {/* Full-Width Backdrop with Movie Title */}
      <div
        className="relative w-full h-[150px] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${
            movie?.backdrop_path || poster_thumbnail
          })`
        }}
      >
        <div className="absolute inset-0 bg-[#474242] opacity-60"></div>
        <div className="absolute top-1/2 left-0 right-0 text-center transform -translate-y-1/2">
          <h1 className="text-5xl max-sm:text-3xl text-white font-normal">
            {category === "tv" ? movie?.name : movie?.title}
          </h1>
        </div>
      </div>

      {/* Movie Poster and Basic Info */}
      <div className="flex lg:flex-row mt-4 max-sm:flex-col">
        <div className="w-full lg:w-1/3">
          {movie?.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
              alt={category === "tv" ? movie?.name : movie?.title}
              className="w-full h-auto shadow-lg"
            />
          ) : (
            <img
              src={poster_thumbnail}
              alt={category === "tv" ? movie?.name : movie?.title}
              className="w-full h-auto shadow-lg opacity-80"
            />
          )}
        </div>
        <div className="ml-0 lg:mx-10 w-full lg:w-2/3 mt-6 lg:mt-0">
          <div>
            <div className="flex space-x-4">
              <div className="flex gap-2 mt-2 mb-4">
                {movie?.genres.map((genre) => (
                  <p
                    key={genre.id}
                    className={`rounded-md px-2 text-white ${
                      genreColors[genre.name] || "bg-red-500"
                    }`}
                  >
                    {genre.name}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              TMDB
              <span className="font-semibold text-yellow-500 pl-2">★</span>
              <span className="text-lg border-r-2 w-14 border-red-200 border-opacity-40">
                {movie?.vote_average.toFixed(1)}
                <span className="text-sm"> /10</span>
              </span>
              <ReactStars
                className="ml-2 mb-0.5"
                count={10}
                size={20}
                half={true}
                value={movie?.vote_average}
                edit={false}
              />
            </div>
            {chitrapatRating ? (
              <div className="flex items-center space-x-2 mb-4">
                {" "}
                CHITRAPAT
                <span className="pl-2 font-semibold text-yellow-500"> ★</span>
                <span className="text-lg border-r-2 w-14 border-red-200 border-opacity-40">
                  {chitrapatRating.toFixed(1)}
                  <span className="text-sm"> /10</span>
                </span>
                <ReactStars
                  className="ml-2 mb-0.5"
                  count={10}
                  size={20}
                  half={true}
                  value={chitrapatRating}
                  edit={false}
                />
              </div>
            ) : (
              ""
            )}
            <h2 className="text-2xl font-medium mb-2 max-sm:hidden">
              {category === "tv" ? movie?.name : movie?.title}
            </h2>
            <p className="mb-6 text-sm text-justify font-light w-full pr-8">
              {movie?.overview}
            </p>
            {movie.status==="Released" ? <ReviewData id={id} />: " "}
          </div>
        </div>
        <div className="flex w-2/12 max-sm:w-1/2 max-sm:mt-4 flex-col gap-6">
          <div>
            <p className="custom-h3 pb-2">Writer :</p>
            <p>{writers}</p>
          </div>
          <div>
            <p className="custom-h3 pb-2">Director :</p>
            <p>{director}</p>
          </div>
          <div>
            <p className="mb-2">
              <p className="custom-h3 pb-2">Release Date :</p>
              {category === "tv"
                ? movie?.first_air_date
                  ? format(new Date(movie.first_air_date), "dd MMM yyyy")
                  : "Not Available"
                : movie?.release_date
                  ? format(new Date(movie.release_date), "dd MMM yyyy")
                  : "Not Available"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex max-sm:flex-col">
        <div className="mt-8 w-[27%] max-sm:w-full">
          <h3 className="text-lg pb-1 font-semibold mb-2 border-b-2 border-red-200 border-opacity-30">
            Cast
          </h3>
          <div className="flex flex-col">
            {cast.slice(0, 8).map((actor) => (
              <div key={actor.id} className="flex flex-row items-center py-1">
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                    alt={actor.name}
                    className="w-10 h-12 mb-2 mr-4"
                  />
                ) : (
                  <div className="w-10 h-12 bg-gray-200 mr-4 mb-2 flex justify-center items-end">
                    <div className="text-gray-400 text-3xl">
                      <FaUser />
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm break-all md:break-words font-semibold pr-2">
                    {actor.name}
                  </p>
                  <p className="text-xs">{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Tabs: Overview, Media, Related Movies */}
        <div className="mt-8 pr-2 w-2/3 max-sm:w-full ml-8 max-sm:ml-0">
          <div className="flex space-x-8 ">
            <button
              onClick={() => setActiveTab("media")}
              className={` ${
                activeTab === "media"
                  ? "text-lg border-b-2 border-[#FFD7D1] border-opacity-30 pb-1"
                  : "text-lg pb-1 opacity-30"
              }`}
            >
              Media
            </button>
            <button
              onClick={() => setActiveTab("relatedMovies")}
              className={` ${
                activeTab === "relatedMovies"
                  ? "text-lg border-b-2 border-[#FFD7D1] border-opacity-30 pb-1"
                  : "text-lg pb-1 opacity-30"
              }`}
            >
              Related Movies
            </button>
            <button
              onClick={() => setActiveTab("review")}
              className={` ${
                activeTab === "review"
                  ? "text-lg border-b-2 border-[#FFD7D1] border-opacity-30 pb-1"
                  : "text-lg pb-1 opacity-30"
              }`}
            >
              Reviews
            </button>
          </div>

          {/* Overview Tab Content */}
          {activeTab === "review" && (
            <div className="mt-4  overflow-scroll">
              <div className="h-[525px]">
                {reviewsData
                  ? reviewsData.map((review) => (
                      <div key={review.id} className="w-full h-auto">
                        <div className="w-full flex items-center ">
                          <div className="w-7 h-7 flex justify-center items-center bg-gray-200 text-gray-400 rounded-full text-xl ">
                            <FaUser />
                          </div>
                          <div>
                            <p className="font-semibold pl-2">
                              {review.user_email}
                            </p>
                            <ReactStars
                              className="ml-2 mb-0.5"
                              count={10}
                              size={12}
                              half={true}
                              value={review.rating}
                              edit={false}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500 pb-4">{review.comment}</p>
                        </div>
                      </div>
                    ))
                  : ""}
                {reviews
                  ? reviews.map((review) => (
                      <div key={review.id} className="w-full h-auto">
                        <div className="w-full flex items-center  mb-2">
                          <div className="w-9 h-9 flex justify-center items-center bg-gray-200 text-gray-400 rounded-full text-2xl justify-end">
                            <FaUser />
                          </div>
                          <p className="font-semibold pl-2">{review.author}</p>
                          <ReactStars
                            className="ml-2 mb-0.5"
                            count={10}
                            size={12}
                            half={true}
                            value={review.author_details.rating}
                            edit={false}
                          />
                        </div>
                        <div>
                          <p className="text-gray-500 pb-4">
                            {review.content.substring(0, 250)}
                          </p>
                        </div>
                      </div>
                    ))
                  : ""}
              </div>
            </div>
          )}

          {/* Media Tab Content */}
          {activeTab === "media" && (
            <div className="mt-4">
              {/* Photos */}
              <div>
                <h4 className="text-xl font-normal mb-4">Photos</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.slice(0, 8).map((photo) => (
                    <img
                      key={photo.file_path}
                      src={`https://image.tmdb.org/t/p/w500${photo.file_path}`}
                      alt="Movie Photo"
                      className="w-full h-auto rounded-md"
                      onClick={() =>
                        openImage(
                          `https://image.tmdb.org/t/p/original${photo.file_path}`
                        )
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Modal */}
              {isOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                  <div className="modal-content">
                    <img
                      src={selectedImage}
                      alt="Selected Media"
                      className="modal-image"
                    />
                  </div>
                </div>
              )}

              {/* Videos (Trailers) */}
              <div className="mt-8">
                <h4 className="text-xl font-normal mb-4">Videos</h4>
                <div className="flex flex-wrap gap-4">
                  {videos.slice(0, 2).map((video) => (
                    <div key={video.id}>
                      <iframe
                      allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"
                        width="300"
                        height="175"
                        src={`https://www.youtube.com/embed/${video.key}`}
                      ></iframe>
                      <span className="mt-8 text-white rounded-lg">
                        {video.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Related Movies Tab Content */}
          {activeTab === "relatedMovies" && (
            <div className="mt-2">
              <h3 className="text-base opacity-50">Related Movies To</h3>
              <h3 className="text-2xl font-semibold mb-2 text-[#DD003F]">
                {movie?.title}
              </h3>
              <div className="flex flex-wrap gap-6 max-sm:gap-4">
                {relatedMovies.map((relatedMovie) => (
                  <div
                    key={relatedMovie.id}
                    onClick={() => handleMovieClick(relatedMovie.id)}
                    className="w-1/4 sm:w-1/4 md:w-1/5 cursor-pointer"
                    style={{ width: isMobile ? "30%" : "20%" }}
                  >
                    {relatedMovie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${relatedMovie.poster_path}`}
                        alt={relatedMovie.title}
                        className="w-[138px] h-[192px] shadow-lg"
                      />
                    ) : (
                      <div className="w-[138px] h-[192px] bg-[#47424281] shadow-lg"></div>
                    )}
                    <p className="mt-2 text-center text-sm">
                      {relatedMovie.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
