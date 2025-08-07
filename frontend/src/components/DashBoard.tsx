import { useEffect, useRef, useState} from "react"
import { NavBar } from "../smallCom/NavBar"
import {  useNavigate } from "react-router-dom"
import { Spotlight } from "./ui/Spotlight";
import { cn } from "./lib/utils"
import { Community } from "../smallCom/Community";



export const Dashboard = () => {
  const [prompt, setPrompt] = useState("");
  const [app,setApp] = useState(false);
  const appRef=useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && prompt.trim()) {
      navigate(`/search/${encodeURIComponent(prompt)}`);
    }
  };

  useEffect(()=>{
    const handleOutSideClick = (event : MouseEvent)=> {
      if(appRef.current && !appRef.current.contains(event.target as Node)){
          setApp(false);
      }
    }
    document.addEventListener("mousedown",handleOutSideClick);
    return ()=>{
      document.removeEventListener("mousedown",handleOutSideClick);
    }
},[]);

  return (
    <div className="bg-[#0E0E10] text-white overflow-y-auto overflow-x-hidden">
      <div className="relative w-screen h-screen overflow-hidden bg-[#0E0E10] flex flex-col items-center justify-center  ">

          <div
            className={cn(
              "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
              "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
            )}
          />

          <Spotlight
            className="-top-20 z-24 left-0 md:-top-20 md:left-60"
            fill="white"
          />

        

        <div className="top-0 left-0 z-20 w-full bg-white shadow-md">
          <NavBar setApp={setApp} />
        </div>
        <div className="absolute top-12 text-center z-20">{
          app === true ? (
            <div ref={appRef}>
                <Community />
            </div>
            
          ):
          <div></div>
        }</div>
        <div className="flex items-center overflow-y-scroll justify-center w-screen min-h-screen bg-[#0E0E10] pt-24">
          <div className="absolute z-20">

            <div className="text-center text-white">
              <h1 className="text-5xl font-medium font-sans">Build Your Dream Website</h1>
              
              <p className="text-white font-normal text-md mt-4 mb-8 font-sans">
                Build beautifully. Effortlessly.
              </p>

              <div className="relative inline-block bg-black">
                <input
                  type="text"
                  className="px-24 py-12 text-sm font-normal rounded-lg text-white bg-[#333333] bg-opacity-50 text-md font-light border  border-gray-700"
                  placeholder="How can Zentra help you....."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                
              </div>
            </div>
              <div className="mt-20 flex justify-center font-normal space-x-5 items-center">
                <div className="text-sm rounded-full pt-1 pb-1 pl-2 pr-2 shadow-xl border border-gray-700 text-gray-400 hover:text-white hover:bg-[#333333] bg-opacity-10 ">Build a mobile app</div>
                <div className="text-sm rounded-full shadow-xl pt-1 pb-1 pl-2 pr-2 border border-gray-700 text-gray-400 hover:text-white hover:bg-[#333333] bg-opacity-10">Make a dashboard with charts</div>
                <div className="text-sm rounded-full shadow-xl pt-1 pb-1 pl-2 pr-2 border border-gray-700 text-gray-400 hover:text-white hover:bg-[#333333] bg-opacity-10">Responsive design out of box</div>
                </div>
              <div className="mt-3 flex justify-center font-normal space-x-5 items-center">
                <div className="flex justify-center items-center pt-1 pb-1 pl-2 pr-2 text-sm rounded-full shadow-xl border border-gray-700 text-gray-400 hover:text-white hover:bg-[#333333] bg-opacity-10">Live code preview</div>
                <div className="text-sm rounded-full shadow-xl pt-1 pb-1 pl-2 pr-2 border border-gray-700 text-gray-400 hover:text-white hover:bg-[#333333] bg-opacity-10">Start a blog</div>
                <div className="text-sm rounded-full shadow-xl pt-1 pb-1 pl-2 pr-2 border border-gray-700 text-gray-400 hover:text-white hover:bg-[#333333] bg-opacity-10">Create a docs site</div>
               </div>
          </div>
          
        </div>
      
       
      </div>
    </div>
  );
};
