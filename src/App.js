import Header from "./components/GlobalComponents/Header";
import Cards from "./components/PLP";
import { Route,Routes,useLocation } from "react-router-dom";
import Addmovie from "./components/Addmovie";
import Details from "./components/Details";
import { createContext, useState, useEffect } from "react";
import Login from "./components/UserAuth/Login";
import Signup from "./components/UserAuth/Signup";
import RapidApi from "./components/RapidApi";
import MovieDetails from "./components/PDP";
import LandingPage from "./components/LandingPage";
import Footer from "./components/GlobalComponents/Footer";
import About from "./components/GlobalComponents/About";
import UserProfile from "./components/UserAuth/UserProfile";
import UserGuide from "./components/UserAuth/UserGuide";
import Privacy from "./components/GlobalComponents/privacy";
const Appstate=createContext();

function App() {
  const [login,setlogin]=useState(!!localStorage.getItem("user")); // Check localStorage for login status;
  const [userName,setUserName]=useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).name : null);

  return (
    <Appstate.Provider value={{login,userName,setUserName,setlogin}}>
    <div className="app">
      <Header/>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/chitrapat/:category/:id" element={<MovieDetails />} /> {/* Movie detail page route */}
        <Route path="/addmovie" element={<Addmovie/>} />
        <Route path="/:lang/:filter" element={<Cards/>} />
        <Route path="/details/:id" element={<Details/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/rapidapi" element={<RapidApi/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/user-profile" element={<UserProfile/>}/>
        <Route path="/user-guide" element={<UserGuide/>}/>
        <Route path="/privacy" element={<Privacy/>}/>
      </Routes>
      <Footer/>
    </div>
    </Appstate.Provider>
  );
}

export default App;
export {Appstate};