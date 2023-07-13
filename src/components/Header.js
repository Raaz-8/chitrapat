import React, { useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
// import { Button } from '@mui/material';
import { Appstate } from "../App";

const Header = () => {
  const useAppstate = useContext(Appstate);
  return (
    <div className="sticky top-0 bg-black z-10 flex justify-between border-b-2 border-gray-300 p-3">
      <Link to={"/"}>
        <span className="text-3xl text-white-500 font-bold cursor-pointer">
          Chitra<span className="text-red-500">pat</span>
        </span>
      </Link>

      {useAppstate.login? <Link to={"/addmovie"}>
      <h1 className="mr-2 text-lg font-bold text-white-500 cursor-pointer">
        <AddIcon className="mb-1 mr-1" />
        Add New
      </h1>
    </Link>  : <div className="flex"><Link to={"/login"}>
    <h1 className="mr-6 text-lg font-bold text-white-500 cursor-pointer">
      Login
    </h1>
  </Link>
  <Link to={"/signup"}>
    <h1 className="mr-2 text-lg font-bold text-white-500 cursor-pointer">
      Signup
    </h1>
  </Link></div>

      }
    </div>
  );
};

export default Header;
