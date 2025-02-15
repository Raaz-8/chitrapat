import React, { useContext, useEffect, useState } from "react";
import ReactStars from "react-stars";
import { reviewDataRef, db } from "../firebase/firebase";
import { addDoc, doc, query, updateDoc, where, getDoc, getDocs,arrayUnion,collection } from "firebase/firestore";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
// import { doc, getDoc, setDoc, updateDoc, increment, addDoc } from "firebase/firestore";
import { Appstate } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { getNextId } from "../helper/firebaseHelper";

const ReviewData = ({ movie_id, prevRating, userRated }) => {
    const {id}=useParams();
  const useAppstate=useContext(Appstate);
  const { login, userName, setUserName, setlogin } = useContext(Appstate);
  const [rating, setRating] = useState(0);
  const [loading, setloading] = useState(false);
  const [thought, setthought] = useState("");
  const [data, setData] = useState([]);
  const [Rloading, setRloading] = useState(false);
  const navigate=useNavigate();
  const [newAdded, setNewAdded]=useState(0);
  const userLocalData = localStorage.getItem("user"); 
  var userEmail="";
  const sendReview = async () => {
    try {
      setloading(true);
      if (userLocalData) {
        // Parse the JSON string into an object
        const userData = JSON.parse(userLocalData);
      
        // Extract the email
        userEmail = userData.email;
      
        console.log("User Email:", userEmail);
      } else {
        console.error("No user data found in local storage.");
      }
    //   const review_id= getNextId(db, parseInt(id, 10));
      if(login){
      await addDoc(reviewDataRef, {
        movie_id: parseInt(id, 10),
        user_email: userEmail,
        rating: rating,
        comment: thought,
        timestamp: new Date(),
      });

    //   const docref = doc(db, "movies", movie_id);
    //   await updateDoc(docref, {
    //     rating: prevRating + rating,
    //     ratedby: userRated + 1,
    //   });
    //----------------------------------------------------to be updated after user profile
    const userRef = collection(db, "user_data");
    const q = query(userRef, where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);
    // Update the movie_id array and badges field
    // await updateDoc(userDocRef, {
    //   movie_id: arrayUnion(parseInt(id, 10)), // Add the new movie_id to the array if it doesn't already exist
    //   badges: arrayUnion(1),    // Add the new badge to the array if it doesn't already exist
    // });
    if (!querySnapshot.empty) {
        // Document with the given email exists, proceed with the update
        const userDocRef = doc(db, "user_data", querySnapshot.docs[0].id); // Get the document reference
  
        // Update the movie_id array using arrayUnion
        await updateDoc(userDocRef, {
          movie_id: arrayUnion(parseInt(id, 10)), // Add new movie_id if not already present
        });}

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
        timer: 50000,
      });
    }
    setloading(false);
  };

  useEffect(() => {
      async function getData() {
        setRloading(true);
        setData([]);
        let quer = query(reviewDataRef, where("movie_id", "==", parseInt(id, 10)));
        const querySnap = await getDocs(quer);
        querySnap.forEach((doc) => {
          setData((prev) => [...prev, doc.data()]);
        });
        setRloading(false);
        localStorage.setItem("reviews", JSON.stringify(data));
        
    }
      getData();
    }, [newAdded]);

  return (
    <div className="mt-4 w-full border-t-2 border-red-200 pt-2 border-opacity-30 ">
    <p className="font-semibold">Already Watched ? Share your views...</p>
    <div className="flex items-center max-sm:flex-col max-sm:items-start max-sm:mt-2"><p className="text-gray-500">Select Stars to give rating : </p>
    <ReactStars
      className="ml-2 max-sm:ml-0 mb-0.5 max-sm:mb-2"
      count={10}
      size={25}
      half={true}
      value={rating}
      onChange={(rate) => setRating(rate)}
    /></div>

      <input
        value={thought}
        onChange={(e) => setthought(e.target.value)}
        placeholder="Share your views ..."
        className="w-full p-2 bg-[#47424281] outline-none header rounded-md"
      />
      <button
        onClick={sendReview}
        className="bg-[#DD003F] flex justify-center w-full p-2 mt-2 mb-2 font-semibold rounded-md"
      >
        {loading ? <TailSpin height={20} color="white" /> : <p className="font-semibold">Share</p>}
      </button>

      {Rloading ? (
        <div className="mt-6 flex justify-center">
          <ThreeDots height={10} color="white" />
        </div>
      ) : (
        <div className="hidden">
          {data.map((e, i) => {
            return (
              <div key={i} className=" border-b border-gray-600 mt-6 bg-gray-700 bg-opacity-30 p-2">
                <div className="flex justify-between items-center">
                  <p className="pb-2 text-blue-500 font-semibold">{e.user_email}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(e.timestamp).toLocaleString()}
                  </p>
                </div>
                <ReactStars
                  className="mb-0.5"
                  count={10}
                  size={20}
                  half={true}
                  value={e.rating}
                  onChange={(rate) => setRating(rate)}
                  edit={false}
                />
                <p>{e.comment}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewData;
