import { useRef, useState ,useEffect} from "react"
import { Button } from "../smallCom/Button"
import { NavBar } from "../smallCom/NavBar"
import { Figma } from "../symbols/Figma"
import { Github } from "../symbols/Github"
import { Bolt, Menu } from "lucide-react"
import { SideBar } from "../smallCom/SideBar"
import { Arrow } from "../symbols/Arrow"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Signup } from "../smallCom/signup"
import { Signin } from "../smallCom/Signin"
import { Tokens } from "../smallCom/Tokens"

import { jwtDecode } from "jwt-decode";
import { Community } from "../smallCom/Community"


export const Dashboard = () => {
    const [gettoken, setgetToken] = useState(false);
    const [username, setUsername] = useState("");
   
    const [com,setCom]=useState(false);
   
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          setUsername(decoded.username);
        } catch (err) {
          localStorage.removeItem("token");
        }
      }
    }, []);
    const [signupButton, setSignupButton] = useState(false);
    const [signinButton, setSigninButton] = useState(false);
    const [hover, setHover] = useState(false);
    const [prompt, setPrompt] = useState("");
    const navigate = useNavigate();
  
    const handleKeyDown = async (e: any) => {
      if (e.key === "Enter" && prompt.trim()) {
        navigate(`/search/${encodeURIComponent(prompt)}`);
      }
    };
  
    return (
      <div className="flex flex-col min-h-screen bg-black">
       
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
          <NavBar setSignupButton={setSignupButton} setSigninButton={setSigninButton} setCom={setCom} username={username}  />
        </div>
        {/* Sidebar */}
       <div className="fixed left-0 text-white z-40 top-0">
          {hover && (
            <SideBar
              hover={hover}
              setHover={setHover}
              username={username}
              setgetToken={setgetToken}
            />
          )}
        </div>
  
       
  
        {/* Main content */}
        <div className="flex items-center justify-center w-screen min-h-screen bg-black pt-24">
  <div>
    {signupButton ? (
      <div className="flex justify-center items-center">
        <Signup setSignupButton={setSignupButton} />
      </div>
    ) : signinButton ? (
      <div className="flex justify-center items-center">
        <Signin setSigninButton={setSigninButton} setUsername={setUsername} />
      </div>
    ) : (
      <div className="text-center text-white">
        <h1 className="text-5xl font-medium">What do you want to build</h1>
        <p className="text-gray-500 font-light text-md mt-4 mb-8">
          Create stunning apps & websites by chatting with AI.
        </p>

        <div className="relative inline-block bg-black">
          <input
            type="text"
            className="px-24 py-12 rounded-lg text-gray-500 bg-black text-md font-light shadow-xl shadow-gray-500"
            placeholder="How Can Bolt help you today"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute top-0 left-0 w-1/2 h-[6px] shadow-[0_-2px_4px_rgba(59,130,246,1)] rounded-tl-lg z-10"></div>
          <div className="absolute top-0 left-0 h-1/2 w-[6px] shadow-[-2px_0_4px_rgba(59,130,246,1)] rounded-tl-lg z-10"></div>
        </div>

        <div className="text-white mt-6">from import</div>
        <div className="flex justify-center mt-4">
       
          <Button placeholder="figma" symbol={true} symbolImage={<Figma />} />
          <Button placeholder="github" symbol={true} symbolImage={<Github />} />
        </div>

        <div className="flex justify-center mt-6 flex-wrap space-x-2">
          <Button placeholder="Build a mobile app" symbol={false} />
          <Button placeholder="Start a blog" symbol={false} />
          <Button placeholder="Create a docs site" symbol={false} />
          <Button placeholder="Make a dashboard with charts" symbol={false} />
        </div>
      </div>
    )}
  </div>
</div>

  
        {/* TOKEN MODAL */}
        {gettoken && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="relative bg-black text-gray-500  p-6 rounded-xl shadow-xl w-[580px]">
              
              <Tokens setgetToken={setgetToken} />
            </div>
          </div>
        )}
        
        {
          com &&  <div className="fixed inset-0 flex h-32 top-12 justify-center z-50 rounded-2xl"><Community setCom={setCom} /></div> 
        }
  

            
          
       
  
        {/* Footer */}
        <footer className="text-gray-500 text-md font-normal flex justify-between px-8 py-4">
          <div className="text-white" onMouseEnter={() => setHover(true)}>
            {!hover && <Menu />}
          </div>
          <div className="flex space-x-4 flex-wrap">
           
            <div className="hover:text-white">Pricing</div>
            <div className="hover:text-white">Blog</div>
            <div className="hover:text-white">Documentation</div>
            <div className="hover:text-white">Help Center</div>
            <div className="hover:text-white">Careers</div>
            <div className="hover:text-white">Terms</div>
            <div className="hover:text-white">Privacy</div>
            <div className="flex text-white mr-4 hover:text-white">
              <Bolt className="mr-2" /> StackBlitz
            </div>
          </div>
        </footer>
      </div>
    );
  };
  