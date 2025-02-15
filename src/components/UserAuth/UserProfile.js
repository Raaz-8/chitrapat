import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { badges } from "../GlobalComponents/Badges";
import Loader from "../GlobalComponents/Loader";

function UserProfile() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [ratedMovies, setRatedMovies] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.email) {
          throw new Error("User is not logged in or email is missing.");
        }

        const usersRef = collection(db, "user_data");
        const userQuery = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setData(userData);

          // Fetch rated movies details if movie IDs exist
          if (userData.movie_id?.length > 0) {
            console.log("Rated Movies IDs:", userData.movie_id);
            const movieDetails = await fetchRatedMovies(userData.movie_id);
            console.log("Fetched Movie Details:", movieDetails);
            setRatedMovies(movieDetails);
          } else {
            console.log("No rated movies found for the user.");
          }
        } else {
          setError("No user found with the provided email.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchRatedMovies = async (movieIds) => {
    try {
      const requests = movieIds.map((id) =>
        axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: {
            api_key: process.env.REACT_APP_TMDB_API_KEY,
          },
        })
      );
      const responses = await Promise.all(requests);
      return responses.map((response) => response.data);
    } catch (err) {
      console.error("Error fetching rated movies:", err);
      return [];
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/chitrapat/movie/${movieId}`);
  };

  const Profile = () => (
    <div className="flex flex-col gap-2">
      {loading ? (
        <Loader/>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
        <label>Name</label>
          <input
            value={data?.name || ""}
            readOnly
            className="p-1 px-2 focus:outline-none bg-[#47424281] opacity-80"
          />
          <label>Email</label>
          <input
            value={data?.email || ""}
            readOnly
            className="p-1 px-2 focus:outline-none bg-[#47424281] opacity-80"
          />
          <label>Joined On</label>
          <input
            value={format(new Date(data?.created_at.toDate()), "dd MMM yyyy p") || ""}
            readOnly
            className="p-1 px-2 focus:outline-none bg-[#47424281] opacity-80"
          />
          <p>Badges Earned</p>
          <ul className="flex flex-wrap gap-4 font-bold">
            {data?.badges?.map((badgeId) => (
              <li key={badgeId} className="w-fit px-2 rounded-sm text-black" style={{ backgroundColor: badges[badgeId]?.bgcolor }}>
                <span>{badges[badgeId]?.name}</span>
              </li>
            ))}
          </ul>
          <p className="px-18 mt-14 rounded-sm text-center bg-[#1692BB] py-1 cursor-pointer">
            DELETE ACCOUNT
          </p>
        </>
      )}
    </div>
  );

  const FavouriteMovies = () => <div>your watchlist.</div>;

  const RatedMovies = () => (
    <div>
      <h2>Movies Rated by you...</h2>
      {ratedMovies.length === 0 ? (
        <p>You haven't rated any movies yet.</p>
      ) : (
        <ul className="flex flex-wrap gap-6 mt-4">
          {ratedMovies.map((movie) => (
            <li
              key={movie.id}
              onClick={() => handleMovieClick(movie.id)}
              className="flex flex-col items-center cursor-pointer"
            >
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className=" w-24 object-cover"
              />
              <p className="mt-2 text-center text-xs">{movie.title}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const ChangeEmail = () => <div>Change your email here.</div>;
  const ChangePassword = () => <div>Change your password here.</div>;

  const renderContent = () => {
    switch (activeMenu) {
      case "profile":
        return <Profile />;
      case "favouriteMovies":
        return <FavouriteMovies />;
      case "ratedMovies":
        return <RatedMovies />;
      case "changeEmail":
        return <ChangeEmail />;
      case "changePassword":
        return <ChangePassword />;
      default:
        return <div>Select a menu to view content</div>;
    }
  };

  return (
    <div className="flex w-full justify-center px-64 max-sm:px-6 my-8 max-sm:pt-8">
      <div className="flex flex-col gap-4 w-2/5  bg-[#4742422f] py-4 md:pl-8 max-sm:pl-2 max-sm:pr-2 text-sm max-sm:text-xs leading-6 max-sm:leading-6">
  
      <div className="md:pt-4">
          <p className="text-lg max-sm:text-sm">Account Details</p>
          <p
            onClick={() => setActiveMenu("profile")}
            className={`cursor-pointer ${activeMenu === "profile" ? "active" : ""}`}
          >
            Profile
          </p>
          <p
            onClick={() => setActiveMenu("changeEmail")}
            className={`cursor-pointer ${activeMenu === "changeEmail" ? "active" : ""}`}
          >
            Change Email
          </p>
          <p
            onClick={() => setActiveMenu("changePassword")}
            className={`cursor-pointer ${activeMenu === "changePassword" ? "active" : ""}`}
          >
            Change Password
          </p>
        </div>
        <div className="pt-6 pb-12">
          <p className="text-lg max-sm:text-sm">Others</p>
          <p
            onClick={() => setActiveMenu("favouriteMovies")}
            className={`cursor-pointer ${activeMenu === "favouriteMovies" ? "active" : ""}`}
          >
            Watchlist
          </p>
          <p
            onClick={() => setActiveMenu("ratedMovies")}
            className={`cursor-pointer ${activeMenu === "ratedMovies" ? "active" : ""}`}
          >
            Rated Movies
          </p>
          <p
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login"); // Redirect to login page
            }}
            className="cursor-pointer"
          >
            Logout
          </p>
        </div>
      </div>
      <div className="w-full pl-8">
        <div className="content">{renderContent()}</div>
      </div>
    </div>
  );
}

export default UserProfile;
