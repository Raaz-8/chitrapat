import React, { useContext, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Link, useLocation } from "react-router-dom";
// import { Button } from '@mui/material';
import { Appstate } from "../../App";
import LOGO from "../../assets/CPLOGO.png";
import SearchMovies from "./SearchMovies";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const useAppstate = useContext(Appstate);
  const location = useLocation();
  // Routes where the search bar should not be displayed
  const hideSearchBarRoutes = ["/signup", "/login", "/privacy","/about","/user-guide","/admin","/user-profile"];

  const shouldShowSearchBar = !hideSearchBarRoutes.includes(location.pathname);
  const [user, setUser] = useState(null);
  const { login, userName, setUserName, setlogin } = useContext(Appstate);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear session
    setlogin(false);
    setUserName(null);
    navigate("/login");
  };

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

  return (
    <div className="relative top-0 z-10 flex justify-between px-24 items-start mb-0 h-auto w-full px-auto max-sm:p-0">
      <div className="w-1/5">
        <Link to={"/"}>
          <div className="cursor-pointer">
            <img
              src={LOGO}
              className="logo -rotate-6 ml-6 mt-4 max-sm:mx-2 max-sm:w-28"
              alt="Chitrapat Logo"
            />
          </div>
        </Link>
      </div>
      <div className="mt-10 w-3/5 max-sm:mt-20 ">
        {shouldShowSearchBar && <SearchMovies />}
      </div>

      {login ? (
        <div className="flex justify-end items-center gap-4 mt-10 w-1/5 text-[#FFD7D1] font-medium max-sm:mt-4 max-sm:pr-2">
          <Link to={"/hi/all"}>
            <h1 className="text-sm cursor-pointer">MOVIES</h1>
          </Link>
          <Link to={"/about"}>
            <h1 className="text-sm cursor-pointer">ABOUT</h1>
          </Link>
          <div className="relative dropdown-container">
            <h1  className="text-base cursor-pointer bg-[#DD003F] px-[0.5rem] py-[0.1rem] text-center rounded-full"
              onClick={() => setDropdownVisible(!dropdownVisible)}
            >
              {userName ? userName.slice(0, 1).toUpperCase() : ":)"}
            </h1>
            {/* Dropdown Menu */}
          </div>
          {dropdownVisible && (
            <div className="absolute text-xs right-24 max-sm:right-2 mt-40 w-28 bg-[#474242] shadow-lg rounded-lg z-50">
              <ul className="py-2">
                <Link to={"/user-profile"}>
                  <li className="px-4 py-2 hover:bg-[#DD003F] cursor-pointer">
                    MY ACCOUNT
                  </li>
                </Link>
                <Link to={"/user-guide"}>
                <li className="px-4 py-2 hover:bg-[#DD003F] cursor-pointer">
                  USER GUIDE
                </li>
                </Link>
                <Link to={"/"}>
                  <li
                    onClick={handleLogout}
                    className=" px-4 py-2 hover:bg-[#DD003F] cursor-pointer"
                  >
                    LOG OUT
                  </li>
                </Link>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-end gap-4 mt-10 w-1/5 text-[#FFD7D1] font-medium max-sm:mt-4 max-sm:pr-2">
          <Link to={"/about"}>
            <h1 className="w-1/3 text-sm cursor-pointer">ABOUT</h1>
          </Link>
          <Link to={"/login"}>
            <h1 className="w-1/3 text-sm cursor-pointer">LOGIN</h1>
          </Link>
          <Link to={"/signup"}>
            <h1 className="w-1/3 text-sm cursor-pointer">SIGNUP</h1>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
