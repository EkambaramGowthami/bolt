import { useEffect, useRef, useState } from "react"
import { NavBar } from "../smallCom/NavBar"
import { useNavigate } from "react-router-dom"
import { Spotlight } from "./ui/Spotlight";
import { cn } from "./lib/utils"
import { Community } from "../smallCom/Community";



export const Dashboard = () => {
  const [prompt, setPrompt] = useState("");
  const [app, setApp] = useState(false);
  const appRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && prompt.trim()) {
      navigate(`/search/${encodeURIComponent(prompt)}`);
    }
  };

  useEffect(() => {
    const handleOutSideClick = (event: MouseEvent) => {
      if (appRef.current && !appRef.current.contains(event.target as Node)) {
        setApp(false);
      }
    }
    document.addEventListener("mousedown", handleOutSideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutSideClick);
    }
  }, []);

  return (
    <div className="bg-[#0E0E10] text-white overflow-y-auto overflow-x-hidden">
      <div className="relative w-screen h-screen overflow-hidden bg-[#0E0E10] flex flex-col items-center justify-center p-2 ">

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



        <div className="top-0 left-0 z-20 w-full shadow-md">
          <NavBar setApp={setApp} />
        </div>
        <div className="absolute top-12 text-center z-20">{
          app === true ? (
            <div ref={appRef}>
              <Community />
            </div>

          ) :
            <div></div>
        }</div>
        <div className="flex md:flex-col items-center overflow-y-scroll justify-center w-screen min-h-screen bg-[#0E0E10] pt-24">
          <div className="absolute z-20">

            <div className="text-center text-white">
              <h1 className="text-3xl sm:text-2xl text-3xl  md:text-5xl font-medium font-sans">Build Your Dream Website</h1>

              <p className="text-white font-light text-sm  md:text-sm mt-4 mb-8 sm:mb-4 font-sans">
                Build beautifully. Effortlessly.
              </p>

              <div className="relative inline-block bg-black rounded-lg">
                <input
                  type="text"
                  className="w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw] h-[12vh] sm:h-[12vh] md:h-[14vh] px-4 md:px-6 lg:px-8 text-sm font-light rounded-lg text-white placeholder:text-xs bg-[#333333] bg-opacity-50 focus:outline-none border border-[#333333]"
                  placeholder="How can zentra help you....."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

              </div>
            </div>

            <div className="mt-8 hidden md:block">
              <div className="flex justify-center font-normal space-x-5 items-center">
                <div className="text-xs rounded-full shadow-xl border border-[#333333] hover:border-2 text-gray-400 hover:text-white hover:bg-[#333333] text-center p-1">Build a mobile app</div>
                <div className="text-xs rounded-full shadow-xl border border-[#333333] text-gray-400 hover:text-white hover:bg-[#333333]  text-center p-1">Make a dashboard with charts</div>
                <div className="text-xs rounded-full shadow-xl border border-[#333333] text-gray-400 hover:text-white hover:bg-[#333333]  text-center p-1">Responsive design out of box</div>
              </div>
              <div className="mt-3 flex justify-center font-normal space-x-5 items-center">
                <div className="text-xs rounded-full shadow-xl border border-[#333333] text-gray-400 hover:text-white hover:bg-[#333333]  text-center p-1">Live code preview</div>
                <div className="text-xs rounded-full shadow-xl border border-[#333333] text-gray-400 hover:text-white hover:bg-[#333333]  text-center p-1">Start a blog</div>
                <div className="text-xs rounded-full shadow-xl border border-[#333333] text-gray-400 hover:text-white hover:bg-[#333333]  text-center p-1">Create a docs site</div>
              </div>
            </div>


            <div className="mt-8 grid grid-cols-2 gap-2 font-normal items-center justify-center md:hidden">
              <div className="text-xs rounded-full shadow-xl border border-[#333333] text-gray-400 hover:text-white hover:bg-[#333333] text-center p-1">Build a mobile app</div>
              <div className="text-sm rounded-full shadow-xl border border-[#333333] text-gray-400 hover:text-white hover:bg-[#333333] text-center p-1">Make a dashboard</div>
              <div className="text-xs rounded-full shadow-xl border border-[#333333] text-gray-400 hover:text-white hover:bg-[#333333] text-center p-1">Responsive design</div>
              <div className="text-xs rounded-full shadow-xl border border-[#333333] text-gray-400 hover:text-white hover:bg-[#333333] text-center p-1">Live code preview</div>
              <div className="text-xs rounded-full shadow-xl border border-[#333333] text-gray-400 hover:text-white hover:bg-[#333333] text-center p-1">Start a blog</div>
              <div className="text-xs rounded-full shadow-xl border border-[#333333] text-gray-400 hover:text-white hover:bg-[#333333] text-center p-1">Create a docs site</div>
            </div>

          </div>


        </div>

      </div >
    </div >
  );
};
