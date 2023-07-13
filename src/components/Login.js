import React, { useContext, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { query,where, getDocs } from "firebase/firestore";
import { usersRef } from "../firebase/firebase";
import bcrypt from 'bcryptjs'
import { Appstate } from "../App";
import swal from "sweetalert";


const Login = () => {
    const useAppstate=useContext(Appstate);
    const navigate=useNavigate();
    const [loading,setLoading]=useState(false);
    const [form,setForm]=useState({
        mobile:"",
        password:""
    })

    const login=async()=>{
        setLoading(true);
        try{
            const quer=query(usersRef,where('mobile','==',form.mobile))
            const querySnapshot=await getDocs(quer);

            querySnapshot.forEach((doc)=>{
                const _data=doc.data();
                const isUser=bcrypt.compareSync(form.password, _data.password);
                if(isUser){
                    useAppstate.setlogin(true);
                    useAppstate.setUserName(_data.name)
                    swal({
                        text:'Logged In Success',
                        icon:'success',
                        buttons:false,
                        timer:3000,
                    }); 
                    navigate('/');
                    setLoading(false);
                }else{
                swal({
                    text:'Logged In Failed',
                    icon:'error',
                    buttons:false,
                    timer:3000,
                });
                setLoading(false);
                }

            })

            
        }catch(error){
            console.log(error);
        }
    }

  return (

  
      <section class="text-white-600 body-font relative  ">
      <div className="bg-login opacity-60 flex justify-center flex-wrap flex-col sm:bg-cover sm:bg-center"></div>
      <div class="flex flex-col justify-center  px-5 py-24 mx-auto ">
          <div class="flex flex-col text-center w-full mb-8">
          <h1 class="sm:text-3xl text-2xl font-medium title-font text-white-900 z-10">Login</h1>
          </div>
          <div class="lg:w-1/2 md:w-2/3 mx-auto m-3  pr-8 pl-8 pb-8 pt-2">
          <div class="flex flex-wrap -m-2 justify-center">
    
              <div class="p-2 w-2/3">
              <div class="relative">
                  <label for="text" class="leading-7 text-sm text-gray-200">Mobile Number</label>
                  <input type={"number"} id="mobile" name="mobile" value={form.mobile} onChange={(e)=>setForm({...form,mobile:e.target.value})} class="w-full bg-white-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-900 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
              </div>
              </div>
              <div class="p-2 w-2/3">
              <div class="relative">
                  <label for="password" class="leading-7 text-sm text-gray-200">Password</label>
                  <input type="password" id="password" name="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} class="w-full bg-white-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-900 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
              </div>
              </div>
              
              <div class="p-2 w-full">
              <button onClick={login} class="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 font-semibold rounded text-lg mt-6">{loading ?<TailSpin height={30} color='#ffffff'/>:'Login'}</button>
              </div>

              <p>Don't have an account ? <Link to={'/signup'} className="text-blue-500">SignUp</Link> </p> 
              
          </div>
          </div>
      </div>
  </section>
      
  );
};

export default Login;
