import axios from "axios";
import { useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";


export const Signin = ({setSigninButton,setUsername}:any) =>{
    const [error,setError]=useState(false);
    const userRef=useRef();
    const emailRef=useRef();
    const passwordRef=useRef();
    const handleOnClick = async () =>{
       
        const username=userRef.current?.value;
        const email=emailRef.current?.value;
        const password=passwordRef.current?.value;
        try{
            const response = await axios.post("http://localhost:3000/signin",{
            username,
            email,
            password
        })
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username",username);
        const decoded: any = jwtDecode(response.data.token);
        console.log(decoded.username);
        setUsername(decoded.username);
        
        setSigninButton(false);
        console.log("signin success",response.data);
       
        }
        catch(error){
            setError(true);
            console.log("Signin error:", error);
        }
        
    }
    return (
        <div className="w-screen h-screen bg-[#0E0E10] flex flex-col justify-center items-center text-center " >
            <div onMouseLeave={()=>setSigninButton(false)} className="bg-[#333333] bg-opacity-50 rounded-lg shadow-lg  p-4 space-y-4">
            <div className="flex justify-center items-center font-md text-3xl text-white">
                Signin
            </div>
            <div className="space-y-3 p-4">
               <div><input type="text" placeholder="username" className="px-12 py-2 rounded" ref={userRef}/></div> 
               <div><input type="text" placeholder="email" className="px-12 py-2 rounded" ref={emailRef} /></div>
               <div><input type="text" placeholder="password" className="px-12 py-2 rounded"  ref={passwordRef} /></div>
               <div className="text-center text-red-500 font-normal text-md">{error && <div>Invalide credentials,try again</div>}</div>
               <div><button className="bg-blue-500 text-white font-md px-4 py-2 rounded" onClick={handleOnClick}  >Signin</button></div>
                
                
                

            </div>

            </div>
            

        </div>
    )
}