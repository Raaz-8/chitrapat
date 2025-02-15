import React from "react";
import { Link, useNavigate } from "react-router-dom";
import LOGO from "../../assets/CPLOGO.png";
import MovieCollagePoster from "../../assets/home-bg.png";
import TmdbLogo from "../../assets/tmdb-svg2.svg";
import getUserData from "../UserAuth/UserData";
function Footer() {
  const navigate = useNavigate();
  const userdata = getUserData();
  return (
    <div className="w-full justify-center h-auto">
    {/* Background Image */}
    <div className="absolute z-0 w-full flex justify-start items-end">
    <img
      src={MovieCollagePoster}
      alt="Movie Posters Collage"
      fill
      className="w-full h-[20rem] opacity-[15%]  left-0"
    />
  </div>
      <div className="flex relative z-10 flex-row justify-center px-24 py-2  pt-6 max-sm:px-2 max-sm:flex-col">
        <div className="w-2/5 max-sm:w-full">
          <Link to={"/"}>
            <div className="cursor-pointer flex justify-center">
              <img
                src={LOGO}
                className="logo-footer -rotate-6 ml-6 mt-4 max-sm:mx-2 max-sm:w-32"
              />
            </div>
          </Link>
        </div>
        <div className="w-3/5 flex gap-6 max-sm:flex-center max-sm:gap-0 justify-center max-sm:w-full max-sm:px-6 max-sm:text-sm">
          <div className="w-1/5 py-4 max-sm:w-1/4 font-light">
            <ul>
              <li className="font-semibold mb-2">Resources</li>
              <Link to={"/about"}><li>About</li></Link>
              <Link to={"/contact-us"}><li>Contact us</li></Link>
              <Link to={"/privacy"}><li>Privacy Policy</li></Link>
            </ul>
          </div>
          <div className="w-1/5 py-4 max-sm:w-1/4 font-light">
            <ul>
              <li className="font-semibold mb-2">Account</li>
              <Link to={userdata?"/user-profile":"/login"}><li className="cursor-pointer">My Account</li></Link>
              <Link to={"/user-guide"}><li>User Guide</li></Link>
            </ul>
          </div>
          <div className="w-2/5 max-sm:w-2/4 py-4 font-light">
          <ul>
          <li className="font-semibold mb-2">Data Source</li>
          <li className="text-sm mb-2 ">Chitrapat website uses the TMDb API <br className="max-sm:hidden" /> but is not endorsed or certified by TMDb.</li>
              <Link to={"https://www.themoviedb.org/"} target="_blank"><li className="cursor-pointer"><img src={TmdbLogo} alt="TMDB LOGO here" className="w-4/5" /></li></Link>
            </ul>
            
          </div>
        </div>
      </div>
      <div className="w-full  pt-16 max-sm:pt-8 flex justify-center text-center text-xs items-end">
        <p>
          &#169; {new Date().getFullYear()} चित्रपट | CHITRAPAT. All Rights
          Reserved. Made With &#9829; By Mayur.{" "}
        </p>
      </div>
    </div>
  );
}

export default Footer;
