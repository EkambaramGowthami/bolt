import axios from "axios";
import { useRef } from "react"
import { useNavigate } from "react-router-dom";

export const Signup = () =>{
  const GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID!
  const REDIRECT_URI = "http://localhost:3000/api/auth/google/callback";
  const handleSigninWithGoogle = ()=>{
    const scope = encodeURIComponent("email profile");
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scope}`;

    window.location.href = url; 

  }
  const navigate=useNavigate();
    const userRef=useRef();
    const emailRef=useRef();
    const passwordRef=useRef();
    const handleOnClick = async () => {
        const username = userRef.current?.value;
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
      
        console.log("Signup input:", { username, email, password });
      
        if (!username || !email || !password) {
          alert("Please fill in all fields.");
          return;
        }
      
        try {
          const response = await axios.post("http://localhost:3000/signup", {
            username,
            email,
            password,
          });
      
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("username",username);
          console.log("signup success", response.data);
          navigate(`/dashboard?name=${encodeURIComponent(username)}`);
          } catch (error) {
          console.error("Signup error:", error);
          alert("Signup failed. Check the console for details.");
        }
      };
      
    return (
        <div className="w-screen h-screen bg-[#0E0E10] flex flex-col justify-center items-center text-center " >
          <div className="bg-[#333333] bg-opacity-50 rounded-lg shadow-lg p-4 space-y-4">
            <div className="flex justify-center items-center font-md text-3xl text-white">
                Signup
            </div>
            <div className="space-y-3 p-4">
               <div><input type="text" placeholder="username" className="px-12 py-2 rounded" ref={userRef}/></div> 
               <div><input type="text" placeholder="email" className="px-12 py-2 rounded" ref={emailRef} /></div>
               <div><input type="text" placeholder="password" className="px-12 py-2 rounded"  ref={passwordRef} /></div>
               <div><button className="bg-blue-500 text-white font-md px-4 py-2 rounded" onClick={handleOnClick}>Create Account</button></div>
               <div onClick={handleSigninWithGoogle} className="text-white flex justify-center items-center">
                <div><img src="/7123025_logo_google_g_icon.png" /></div>
                <div>signin with google</div>
                </div>
            </div>
        </div>
      </div>
    )
}