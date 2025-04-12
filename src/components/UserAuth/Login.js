import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { query, where, getDocs } from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";
import { usersRef, auth, googleProvider } from "../../firebase/firebase";
import bcrypt from "bcryptjs";
import { Appstate } from "../../App";
import swal from "sweetalert";
import MovieCollagePoster from "../../assets/home-bg.png" 

const Login = () => {
    const useAppstate = useContext(Appstate);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    // Check session on component mount
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            useAppstate.setlogin(true);
            useAppstate.setUserName(storedUser.name);
            navigate("/");
        }
    }, [navigate, useAppstate]);

    // Traditional Email/Password Login
    const login = async () => {
        setLoading(true);
        try {
            const quer = query(usersRef, where("email", "==", form.email));
            const querySnapshot = await getDocs(quer);

            if (querySnapshot.empty) {
                swal({ text: "No user found with this email", icon: "error", timer: 3000 });
                setLoading(false);
                return;
            }

            querySnapshot.forEach((doc) => {
                const _data = doc.data();
                const isUser = bcrypt.compareSync(form.password, _data.password);
                if (isUser) {
                    useAppstate.setlogin(true);
                    useAppstate.setUserName(_data.name);
                    const sessionDuration = 60 * 60 * 1000; // 1 hour in ms
                    const expiresAt = Date.now() + sessionDuration;

                    const sessionData = {
                        ..._data,
                        expiresAt,
                    };
                    localStorage.setItem("user", JSON.stringify(sessionData));

                    swal({ text: "Logged In Successfully", icon: "success", timer: 3000 });
                    navigate("/");
                } else {
                    swal({ text: "Incorrect password", icon: "error", timer: 3000 });
                }
                setLoading(false);
            });
        } catch (error) {
            console.error(error);
            swal({ text: "An error occurred while logging in", icon: "error", timer: 3000 });
            setLoading(false);
        }
    };

    // Google OAuth Login
    const googleLogin = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if user already exists in Firestore
            const userQuery = query(usersRef, where("email", "==", user.email));
            const userSnapshot = await getDocs(userQuery);

            let userData;
            if (userSnapshot.empty) {
                // New user, add to Firestore
                userData = { name: user.displayName, email: user.email, movie_id: [], badges: [0] };
            } else {
                userData = userSnapshot.docs[0].data();
            }

            // Save user session
            useAppstate.setlogin(true);
            useAppstate.setUserName(userData.name);
            localStorage.setItem("user", JSON.stringify(userData));

            swal({ text: `Welcome, ${userData.name}!`, icon: "success", timer: 3000 });
            navigate("/");
        } catch (error) {
            console.error("Google Login Error:", error);
            swal({ text: "Google login failed", icon: "error", timer: 3000 });
        } finally {
            setLoading(false);
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
            <div className="relative flex flex-col justify-center px-5 py-10 mb-14 mx-auto z-10">
                <div className="flex flex-col text-center w-full mb-8">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font text-white-900 z-10 pt-8">Login</h1>
                </div>
                <div className="lg:w-1/2 md:w-2/3 mx-auto m-3 pr-8 pl-8 pb-8 pt-2">
                    <div className="flex flex-wrap  justify-center gap-4">
                        <div className="w-2/3">
                            <div className="relative">
                                <input type="email" placeholder="Enter Your Email" id="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-[#2a2a2a]/80 bg-opacity-50  border border-red-100 text-base outline-none  py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                            </div>
                        </div>
                        <div className="w-2/3">
                            <div className="relative">
                                <input type="password" placeholder="Enter Your Password" id="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-[#2a2a2a]/80   border border-red-100 text-base outline-none  py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                            </div>
                        </div>

                        <div className="w-2/3 text-center">
                            <button onClick={login} className={`w-full  mx-auto ${loading ? "opacity-70" :""} text-white bg-[#EC5A1A] border-0 py-2 px-8 focus:outline-none hover:bg-[#e05012] font-semibold text-lg `}>
                                Login
                            </button>
                        </div>

                        <div className="w-2/3 text-center">
                            <button onClick={googleLogin} className={`w-full  mx-auto ${loading ? "opacity-70" :""}text-white bg-[#DD003F] border-0 py-2 px-8 focus:outline-none hover:bg-[#c80039] font-semibold text-lg `}>
                                 Login with Google
                            </button>
                        </div>

                        <div className="w-1/2 text-center font-semibold"><p>Don't have an account? <Link to={"/signup"} className="text-blue-500">Sign Up</Link></p></div>
                    </div>
                </div>
            </div>
        </section>
        
    );
};

export default Login;




// import Link from "next/link"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"

// export default function LoginPage() {
//   return (
//     <div className="min-h-screen bg-[#1a1a1a] text-white">
//       {/* Navigation */}
//       <nav className="relative z-20 flex justify-between items-center p-4">
//         <Link href="/" className="flex items-center">
//           <Image
//             src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-30%20173518-pKCXiTiEuu1OzpMcIXvJnBb2mv8MQl.png"
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
//           <Link href="/login" className="text-pink-500 hover:text-pink-400">
//             LOGIN
//           </Link>
//           <Link href="/signup" className="hover:text-gray-300">
//             SIGNUP
//           </Link>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="relative min-h-[calc(100vh-80px)]">
//         {/* Background Image */}
//         <div className="absolute inset-0 z-0">
//           <Image
//             src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%201-RfUUyoDx7lYl0KJYZcz0S6QGOxNHUX.png"
//             alt="Movie Posters Collage"
//             fill
//             className="object-cover opacity-40"
//           />
//           <div className="absolute inset-0 bg-black/70" />
//         </div>

//         {/* Login Form */}
//         <div className="relative z-10 flex justify-center items-center min-h-[calc(100vh-80px)]">
//           <div className="w-full max-w-md p-8">
//             <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
//             <form className="space-y-4">
//               <input
//                 type="email"
//                 placeholder="Enter Your Email"
//                 className="w-full p-3 bg-[#2a2a2a]/80 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
//               />
//               <input
//                 type="password"
//                 placeholder="Enter Your Password"
//                 className="w-full p-3 bg-[#2a2a2a]/80 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
//               />

//               <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded">Login</Button>

//               <Button variant="secondary" className="w-full bg-[#f4511e] hover:bg-[#e64a19] text-white py-3 rounded">
//                 Login With Google
//               </Button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

