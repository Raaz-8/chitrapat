import React, { useContext, useEffect, useState } from "react";
import ReactStars from "react-stars";
import { reviewsRef, db } from "../firebase/firebase";
import { addDoc, doc, query, updateDoc, where } from "firebase/firestore";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import { getDocs } from "firebase/firestore";
import { Appstate } from "../App";
import { useNavigate } from "react-router-dom";

const Review = ({ id, prevRating, userRated }) => {
  const useAppstate=useContext(Appstate);
  const [rating, setRating] = useState(0);
  const [loading, setloading] = useState(false);
  const [thought, setthought] = useState("");
  const [data, setData] = useState([]);
  const [Rloading, setRloading] = useState(false);
  const navigate=useNavigate();
  const [newAdded, setNewAdded]=useState(0);
  const sendReview = async () => {
    try {
      setloading(true);
      if(useAppstate.login){
      await addDoc(reviewsRef, {
        movieid: id,
        name: useAppstate.userName,
        rating: rating,
        thought: thought,
        timestamp: new Date().getTime(),
      });

      const docref = doc(db, "movies", id);
      await updateDoc(docref, {
        rating: prevRating + rating,
        ratedby: userRated + 1,
      });

      swal({
        title: "Review Sent",
        icon: "success",
        buttons: false,
        timer: 3000,
      });

      setthought("");
      setRating();
      setNewAdded(newAdded+1);}else{
        navigate('/login');
      }
    } catch (error) {
      swal({
        title: error.message,
        icon: "Error",
        buttons: false,
        timer: 3000,
      });
    }
    setloading(false);
  };

  useEffect(() => {
    async function getData() {
      setRloading(true);
      setData([]);
      let quer = query(reviewsRef, where("movieid", "==", id));
      const querySnap = await getDocs(quer);
      querySnap.forEach((doc) => {
        setData((prev) => [...prev, doc.data()]);
      });
      setRloading(false);
      
    }
    getData();
  }, [newAdded]);

  return (
    <div className="mt-4 w-full border-t-2 border-gray-400">
    <div className="flex items-center"><p className="text-gray-500 ml-2">Select Stars to give rating : </p>
    <ReactStars
      className="ml-2 mb-0.5"
      size={30}
      half={true}
      value={rating}
      onChange={(rate) => setRating(rate)}
    /></div>

      <input
        value={thought}
        onChange={(e) => setthought(e.target.value)}
        placeholder="Share your views ..."
        className="w-full p-2 bg-gray-800 outline-none header rounded-md"
      />
      <button
        onClick={sendReview}
        className="bg-green-600 flex justify-center w-full p-2 mt-2 mb-2 rounded-md"
      >
        {loading ? <TailSpin height={20} color="white" /> : "Share"}
      </button>

      {Rloading ? (
        <div className="mt-6 flex justify-center">
          <ThreeDots height={10} color="white" />
        </div>
      ) : (
        <div>
          {data.map((e, i) => {
            return (
              <div key={i} className=" border-b border-gray-600 mt-6 bg-gray-700 bg-opacity-30 p-2">
                <div className="flex justify-between items-center">
                  <p className="pb-2 text-blue-500 font-semibold">{e.name}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(e.timestamp).toLocaleString()}
                  </p>
                </div>
                <ReactStars
                  className="mb-0.5"
                  size={15}
                  half={true}
                  value={e.rating}
                  onChange={(rate) => setRating(rate)}
                />
                <p>{e.thought}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Review;
