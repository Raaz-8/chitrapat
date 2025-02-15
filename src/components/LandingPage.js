import React, { useState,useEffect } from "react";
import TopRated from "./LandingPage/TopRated";
import TopPicksofTheWeek from "./LandingPage/TopPicksofTheWeek";
import Popular from "./LandingPage/Popular";
import Upcoming from "./LandingPage/Upcoming";
import Loader from "./GlobalComponents/Loader";
import HollywoodMovies from "./LandingPage/HollywoodMovies";
import WebSeries from "./LandingPage/WebSeries";

const LandingPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 3 seconds
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  return (
    <div className="home-page z-0">
    {loading ? <Loader /> : 
      <div>
      <div className="bg-home opacity-10 flex justify-center flex-wrap flex-col sm:bg-cover sm:bg-center"></div>
      <TopRated />
      {/* #1 Top Rated Section */}
      {/* Other Sections */}
      <div className="sections-container">
        {/* Top Picks of The Week Section */}
        <TopPicksofTheWeek />
        {/* Popular Section */}
        <Popular />
        {/* Hollywood Movies Section */}
        <HollywoodMovies />
        {/* Web Series Section */}
        <WebSeries />
        {/* Upcoming Section */}
        <Upcoming />
      </div>
      </div>
    }
    </div>
  );
};

export default LandingPage;
