import axios from "axios";
import { useRef } from "react"

export const Signup = ({setSignupButton}:any) =>{
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
          setSignupButton(false);
          console.log("signup success", response.data);
      
          
          
        } catch (error) {
          console.error("Signup error:", error);
          alert("Signup failed. Check the console for details.");
        }
      };
      
    return (
        <div className="text-center rounded-lg shadow-lg p-6 shadow-lg shadow-blue-500" onMouseLeave={()=>setSignupButton(false)}>
            <div className="flex justify-center items-center font-md text-3xl text-blue-500">
                Signup
            </div>
            <div className="space-y-3 p-4">
               <div><input type="text" placeholder="username" className="px-12 py-2 rounded" ref={userRef}/></div> 
               <div><input type="text" placeholder="email" className="px-12 py-2 rounded" ref={emailRef} /></div>
               <div><input type="text" placeholder="password" className="px-12 py-2 rounded"  ref={passwordRef} /></div>
               <div><button className="bg-blue-500 text-white font-md px-4 py-2 rounded" onClick={handleOnClick}>Submit</button></div>
                
                
                

            </div>

        </div>
    )
}