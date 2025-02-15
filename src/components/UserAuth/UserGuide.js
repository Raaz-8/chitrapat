import React from 'react'
import movieWatched from "../../assets/movie_watched.png";
import downArrow from "../../assets/down_arrow.png";
import { Link } from 'react-router-dom';
import getUserData from './UserData';

function UserGuide() {
    const userData=getUserData();
  return (
    <div className="min-h-screen bg-[#1a1a1a] ">
      {/* Navigation */}
      

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Hello  {userData?.name ||"USER"},</h1>
          <p className="text-gray-400">Here's a guide for you</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Ratings Section */}
          <div className="text-center p-6  bg-gray-800/50 rounded-lg">
          <p className='font-bold'>Give</p>
            <h2 className="text-2xl font-bold  mb-4">
              RATINGS & WRITE
              <br />
              REVIEWS
            </h2>
          </div>

          {/* Movies Section */}
          <div className="text-center p-6 bg-gray-800/50 rounded-lg">
          <p className='font-bold'>For the</p>
            <h2 className="text-2xl font-bold  mb-4">
              MOVIES, SERIES
              <br />& TV SHOWS
            </h2>
          </div>

          {/* Watched Section */}
          <div className="text-center p-6 bg-gray-800/50 rounded-lg relative">
            <img
              src={movieWatched}
              alt="Watching Icon"
              width={100}
              height={100}
              className="mx-auto  "
            />
            <div className="bg-red-100 text-gray-900 py-1 px-4 font-bold rounded-full inline-block">YOU'VE WATCHED</div>
          </div>
        </div>
        <div className='flex justify-center'><img src={downArrow} alt='Down Arrow here' width={60} height={60} className='rotate-[35deg]' /></div>
        {/* Features List */}
        <div className="flex justify-center items-center gap-8 max-sm:gap-4 mb-12 mt-4">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Get Personalized
              <br />
              Movie Recommendations
            </p>
          </div>
          <div className="text-gray-400 text-4xl">|</div>
          <Link to={"/hi/all"}>
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 max-sm:px-4 max-sm:py-1 max-sm:rounded-2xl rounded-full max-sm:text-sm">Rate Now</button>
          </Link>
          <div className="text-gray-400 text-4xl">|</div>
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Get Badges Based On
              <br />
              Your Activity
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-400 mt-14 w-full text-sm py-1 bg-[#47424263]">Thank You {userData?.name || "User"}, For Visiting चित्रपट | CHITRAPAT</footer>
      </main>
    </div>
  )
}

export default UserGuide