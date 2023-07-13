import { getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import ReactStars from "react-stars";
import { moviesRef } from "../firebase/firebase";
import { Link } from "react-router-dom";

const Cards = () => {
  const [data, setdata] = useState([]);
  const [loading, setloading] = useState(false);
  useEffect(() => {
    async function getData() {
      setloading(true);

      const _data = await getDocs(moviesRef);
      _data.forEach((doc) => {
        setdata((prv) => [...prv, { ...doc.data(), id: doc.id }]);
      });

      setloading(false);
    }
    getData();
  }, []);

  return (
    <div className="flex flex-wrap justify-between px-2 mt-2 md:mr-20 md:ml-20 ">
      {loading ? (
        <div className="w-full flex justify-center items-center h-96 mt-24">
          <ColorRing
            visible={true}
            height="100"
            width="100"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#FF0000", "#FF4D4D", "#FF9999", "#FFCCCC", "#FFF5F5"]}
          />
        </div>
      ) : (
        data.map((e, i) => {
          return (
            <Link to={`/details/${e.id}`}>
              <div
                key={i}
                className="bg-gray-800 p-2 w-44 md:w-56  hover:translate-y-2 font-semibold mt-5 transition-all duration-200 flex flex-col justify-center">
                <img className="h-60 md:h-72" src={e.link} />
                <h1 className="mt-2 break-all md:break-words">{e.name}</h1>
                <h1 className="flex items-center">
                  <span className="text-gray-400">Rating:</span>
                  <ReactStars
                    className="ml-2 mb-0.5"
                    size={20}
                    half={true}
                    value={e.rating/e.ratedby}
                    edit={false}
                  />
                </h1>
                <h1>
                  <span className="text-gray-400">Year:</span> {e.year}
                </h1>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};

export default Cards;
