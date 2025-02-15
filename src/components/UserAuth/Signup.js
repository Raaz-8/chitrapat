import React, { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { addDoc, query, where, getDocs } from "firebase/firestore";
import { usersRef } from "../../firebase/firebase";
import swal from "sweetalert";
import bcrypt from "bcryptjs";
import app from "../../firebase/firebase";
import { serverTimestamp } from "firebase/firestore";
import MovieCollagePoster from "../../assets/home-bg.png";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Function to validate email format
  const isValidEmail = (email) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const handleSignup = async () => {
    try {
      setLoading(true);

      // Validate email format
      if (!isValidEmail(form.email)) {
        swal({
          text: "Invalid email format. Please enter a valid email.",
          icon: "warning",
          buttons: false,
          timer: 3000,
        });
        setLoading(false);
        return;
      }

      // Check if email already exists
      const emailQuery = query(usersRef, where("email", "==", form.email));
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        swal({
          text: "This email is already registered.",
          icon: "warning",
          buttons: false,
          timer: 3000,
        });
        setLoading(false);
        return;
      }

      // Hash the password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(form.password, salt);

      // Create user with email and password
      await createUserWithEmailAndPassword(auth, form.email, form.password);

      // Send email verification link
      const actionCodeSettings = {
        url: "http://localhost:3000/login",
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, form.email, actionCodeSettings);

      // Save user to Firestore
      await addDoc(usersRef, {
        name: form.name,
        email: form.email,
        password: hash,
        movie_id: [],
        badges: [0],
        created_at: serverTimestamp(),
      });

      swal({
        text: "Signup successful! Check your email for verification.",
        icon: "success",
        buttons: false,
        timer: 3000,
      });
      setForm({ name: "", email: "", password: "" });
      navigate("/login");
    } catch (error) {
      console.error(error);
      swal({ text: error.message, icon: "error", buttons: false, timer: 3000 });
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Signup
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user already exists
      const userQuery = query(usersRef, where("email", "==", user.email));
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        // Save new user to Firestore
        await addDoc(usersRef, {
          name: user.displayName,
          email: user.email,
          movie_id: [],
          badges: [0],
          created_at: serverTimestamp(),
        });
      }

      swal({
        text: "Signup successful! Welcome!",
        icon: "success",
        buttons: false,
        timer: 3000,
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
      swal({
        text: "Google sign-in failed!",
        icon: "error",
        buttons: false,
        timer: 3000,
      });
    }
  };

  return (
    <section className="text-white-600 body-font relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 flex justify-center items-center">
        <img
          src={MovieCollagePoster}
          alt="Movie Posters Collage"
          fill
          className="object-cover max-sm:object-fill w-[50%] max-sm:w-[120rem] max-sm:rotate-90  opacity-20"
        />
      </div>

      <div className="relative flex flex-col justify-center px-5 py-10 max-sm:px-2 max-sm:py-4 mb-14 mx-auto z-10">
        <div className="flex flex-col text-center w-full mb-8">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-white-900 z-10 pt-8">
            Signup
          </h1>
        </div>
        <div className="lg:w-full md:w-2/3 max-sm:w-full pr-8 pl-8 pb-8 pt-2 flex justify-center">
          <div className="flex flex-col w-1/3 max-sm:w-3/5 justify-center gap-4">
            <div className="relative justify-center">
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#2a2a2a]/80 bg-opacity-50  border border-red-100 text-base outline-none  py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div>
              {" "}
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#2a2a2a]/80 bg-opacity-50  border border-red-100 text-base outline-none  py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div>
              {" "}
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-[#2a2a2a]/80 bg-opacity-50  border border-red-100 text-base outline-none  py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="text-center">
              <button className={`w-full  mx-auto ${loading ? "opacity-70" :""} text-white bg-[#1692BB] border-0 py-2 px-8 focus:outline-none hover:bg-[#0e7394] font-semibold text-lg `} onClick={handleSignup}>
                Signup
              </button>
            </div>
            <div className="text-center">
              <button className={`w-full  mx-auto ${loading ? "opacity-70" :""} text-white bg-[#DD003F] border-0 py-2 px-8 focus:outline-none hover:bg-[#c80039] font-semibold text-lg `} onClick={handleGoogleSignup}>
              Sign up with Google
              </button>
            </div>
            <div className="text-center">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;

// import Link from "next/link"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"

// export default function SignupPage() {
//   return (
//     <div className="min-h-screen bg-[#1a1a1a] text-white relative">
//       {/* Background Image */}
//       <div className="absolute inset-0 z-0">
//         <div className="absolute inset-0 bg-black/70 z-10" />
//         <Image
//           src="/placeholder.svg?height=1080&width=1920"
//           alt="Movie Collage"
//           fill
//           className="object-cover opacity-40"
//         />
//       </div>

//       {/* Navigation */}
//       <nav className="relative z-20 flex justify-between items-center p-4">
//         <Link href="/" className="flex items-center">
//           <Image
//             src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-30%20172751-XAnqX89ezSzZkEm3aqoRwYrSYNzEAr.png"
//             alt="Chitrapat Logo"
//             width={150}
//             height={50}
//             className="object-contain"
//           />
//         </Link>
//         <div className="flex items-center gap-6">
//           <Link href="/about" className="hover:text-gray-300">
//             ABOUT
//           </Link>
//           <Link href="/login" className="hover:text-gray-300">
//             LOGIN
//           </Link>
//           <Link href="/signup" className="text-pink-500 hover:text-pink-400">
//             SIGNUP
//           </Link>
//         </div>
//       </nav>

//       {/* Signup Form */}
//       <div className="relative z-20 flex justify-center items-center min-h-[calc(100vh-80px)]">
//         <div className="w-full max-w-md p-8">
//           <h1 className="text-3xl font-bold text-center mb-8">SIGNUP</h1>
//           <form className="space-y-4">
//             <input
//               type="text"
//               placeholder="Enter Your Name"
//               className="w-full p-3 bg-[#2a2a2a]/80 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
//             />
//             <input
//               type="email"
//               placeholder="Enter Your Email"
//               className="w-full p-3 bg-[#2a2a2a]/80 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
//             />
//             <input
//               type="password"
//               placeholder="Enter Your Password"
//               className="w-full p-3 bg-[#2a2a2a]/80 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
//             />
//             <input
//               type="password"
//               placeholder="Re-Type Password"
//               className="w-full p-3 bg-[#2a2a2a]/80 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
//             />

//             <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded">Register</Button>

//             <Button variant="secondary" className="w-full bg-[#17a2b8] hover:bg-[#138496] text-white py-3 rounded">
//               Signup With Google
//             </Button>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }
