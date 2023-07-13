import React from "react";
import { TailSpin } from "react-loader-spinner";
import { useState } from "react";
import { Link } from "react-router-dom";
import {getAuth, RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth"
import app from '../firebase/firebase'
import swal from "sweetalert";
import bcrypt from 'bcryptjs'
import { addDoc } from "firebase/firestore";
import { usersRef } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
const auth=getAuth(app);


const Signup = () => {
    const navigate=useNavigate();
  const [form, setForm] = useState({
    name: "",
    mobile: "" ,
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpsent, setOtpsent] = useState(false);
  const [OTP, setOTP] = useState("");

  const generateRecaptcha=()=>{
    console.log('in generate1');
    window.recaptchaVerifier= new RecaptchaVerifier('recaptcha-container',{
        'size':'invisible',
        'callback':(response)=>{
        }
    },auth);
    console.log('in generate2');
  }

  const requestOtp=()=>{
    setLoading(true);
    console.log('in requestotp function')
    generateRecaptcha();
    console.log('in generate');
    let appVerifier =window.recaptchaVerifier;
      signInWithPhoneNumber(auth,`+91${form.mobile}`,appVerifier)
      .then(confirmationResult=>{
        window.confirmationResult=confirmationResult;
        swal({
            text:'OTP sent to your number',
            icon:'success',
            buttons:false,
            timer:3000,
        });
        setOtpsent(true);
        setLoading(false);

      }).catch((error)=>{
        console.log(error)
    })
  }

  const verifyOTP=()=>{
    try{
        setLoading(true);
        window.confirmationResult.confirm(OTP).then((result)=>{
            uploadData();
            swal({
                text:'Successfully Registered',
                icon:'success',
                buttons:false,
                timer:3000,
            });
            navigate('/login');
            setLoading(false);
            setForm({
                name: "",
                mobile: "" ,
                password: ""
            })
        })
    }catch(error){
        console.log(error);
    }
  }

  const uploadData= async()=>{
    try{
    const salt=bcrypt.genSaltSync(10);
    var hash=bcrypt.hashSync(form.password,salt);

    await addDoc(usersRef,{
        name:form.name,
        password:hash,
        mobile:form.mobile
    }); 
    }catch(error){
        console.log(error);
    }
  }

  return (
    <section className="text-white-600 body-font relative  ">
    <div className="bg-login opacity-60 flex justify-center flex-wrap flex-col sm:bg-cover sm:bg-center"></div>
      <div className="flex flex-col justify-center  px-5 py-24 mx-auto ">
        <div className="flex flex-col text-center w-full mb-8">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-white-900 z-10">
            Signup
          </h1>
        </div>

        {otpsent ? (
          <div>
            <div className="p-2 w-full flex justify-center">
              <div className="relative">
                <label htmlFor="text" className="leading-7 text-sm text-gray-200">
                  OTP
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  value={OTP}
                  onChange={(e) =>
                    setOTP(e.target.value)
                  }
                  className="w-full bg-white-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-900 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>

            <div className="p-2 w-full">
              <button className="flex mx-auto text-white bg-green-600 border-0 py-2 px-6 focus:outline-none hover:bg-green-700 font-semibold rounded text-md mt-6" onClick={verifyOTP}>
                {loading ? (
                  <TailSpin height={30} color="#ffffff" />
                ) : (
                  "Confirm OTP"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:w-1/2 md:w-2/3 mx-auto m-3  pr-8 pl-8 pb-8 pt-2">
            <div className="flex flex-wrap -m-2 justify-center">
              <div className="p-2 w-2/3">
                <div className="relative">
                  <label htmlFor="name" className="leading-7 text-sm text-gray-200">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white-800 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-2/3">
                <div className="relative">
                  <label htmlFor="number" className="leading-7 text-sm text-gray-200">
                    Mobile Number
                  </label>
                  <input
                    type="Number"
                    id="mobile"
                    name="mobile"
                    value={form.mobile}
                    onChange={(e) =>
                      setForm({ ...form, mobile: e.target.value })
                    }
                    className="w-full bg-white-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-900 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-2/3">
                <div className="relative">
                  <label htmlFor="password" className="leading-7 text-sm text-gray-200">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full bg-white-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-900 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div className="p-2 w-full">
                <button className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 font-semibold rounded text-lg mt-6" onClick={requestOtp}>
                  {loading ? (
                    <TailSpin height={30} color="#ffffff" />
                  ) : (
                    "Request OTP"
                  )}
                </button>
              </div>

              <p>
                Already have an account ? 
                <Link to={"/login"} className="text-blue-500">
                  Login
                </Link>{" "}
              </p>
            </div>
            <div id='recaptcha-container'></div>
          </div>

          
        )}
      </div>
    </section>
  );
};

export default Signup;
