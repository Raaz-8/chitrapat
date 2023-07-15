import React, { useContext, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { addDoc } from "firebase/firestore";
import { moviesRef } from "../firebase/firebase";
import swal from "sweetalert";
import { Appstate } from "../App";
import { useNavigate } from "react-router-dom";
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
const Addmovie = () => {
  const useAppstate = useContext(Appstate);
  const navigate = useNavigate();
  const [form, setform] = useState({
    name: "",
    year: "",
    desc: "",
    link: "",
    rating: "",
    ratedby: "",
  });

  const [loading, setloading] = useState(false);

  const addMovie = async () => {
    setloading(true);
    try {
      if (useAppstate.login) {
        await addDoc(moviesRef, form);
        swal({
          title: "Success",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        setform({
          name: "",
          year: "",
          desc: "",
          link: "",
        });
      } else {
        navigate("/login");
      }
    } catch (err) {
      swal({
        title: "Error",
        icon: "error",
        buttons: false,
        timer: 3000,
      });
    }

    setloading(false);
  };

  return (
    <div>
      <section class="text-white-600 body-font relative">
        <div class="container px-5 py-24 mx-auto">
          <div class="flex flex-col text-center w-full mb-12">
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-white-900">
              <TheaterComedyIcon className="mr-3 mb-1"/>Add Movie<TheaterComedyIcon className="ml-3 mb-1"/>
            </h1>
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
              Fill the Details below to add the movie you want for the ratings.
            </p>
          </div>
          <div class="lg:w-1/2 md:w-2/3 mx-auto">
            <div class="flex flex-wrap -m-2">
              <div class="p-2 w-full">
                <div class="relative">
                  <label for="name" class="leading-7 text-sm text-gray-200">
                    Movie Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={(e) => setform({ ...form, name: e.target.value })}
                    class="w-full bg-white-800 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div class="p-2 w-1/2">
                <div class="relative">
                  <label for="text" class="leading-7 text-sm text-gray-200">
                    Image Poster Link
                  </label>
                  <input
                    type="text"
                    id="img-link"
                    name="img-link"
                    value={form.link}
                    onChange={(e) => setform({ ...form, link: e.target.value })}
                    class="w-full bg-white-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-900 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div class="p-2 w-1/2">
                <div class="relative">
                  <label for="text" class="leading-7 text-sm text-gray-200">
                    Year
                  </label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={form.year}
                    onChange={(e) => setform({ ...form, year: e.target.value })}
                    class="w-full bg-white-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-900 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div class="p-2 w-full">
                <div class="relative">
                  <label for="message" class="leading-7 text-sm text-gray-200">
                    Movie Description
                  </label>
                  <textarea
                    id="desc"
                    name="desc"
                    value={form.desc}
                    onChange={(e) => setform({ ...form, desc: e.target.value })}
                    class="w-full bg-white-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  ></textarea>
                </div>
              </div>
              <div class="p-2 w-full">
                <button
                  onClick={addMovie}
                  class="flex mx-auto text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-700 font-semibold rounded text-lg"
                >
                  {loading ? (
                    <TailSpin height={30} color="#ffffff" />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
              <div class="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
                <span class="inline-flex">
                  <a class="text-gray-500">
                    <svg
                      fill="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      class="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                    </svg>
                  </a>
                  <a class="ml-4 text-gray-500">
                    <svg
                      fill="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      class="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                    </svg>
                  </a>
                  <a class="ml-4 text-gray-500">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      class="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <rect
                        width="20"
                        height="20"
                        x="2"
                        y="2"
                        rx="5"
                        ry="5"
                      ></rect>
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                    </svg>
                  </a>
                  <a class="ml-4 text-gray-500">
                    <svg
                      fill="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      class="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                    </svg>
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Addmovie;
