import { useRef, useState, useEffect } from "react"
import { Button } from "../smallCom/Button"
import { NavBar } from "../smallCom/NavBar"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import { Spotlight } from "./ui/Spotlight";
import { cn } from "./lib/utils"


export const Dashboard = () => {
  
  const [hover, setHover] = useState<number | null>(null);


  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     try {
  //       const decoded: any = jwtDecode(token);
  //       setUsername(decoded.username);
  //     } catch (err) {
  //       localStorage.removeItem("token");
  //     }
  //   }
  // }, []);
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter" && prompt.trim()) {
      navigate(`/search/${encodeURIComponent(prompt)}`);
    }
  };


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

        

        <div className="top-0 left-0 z-20 w-full bg-white shadow-md z-50">
          <NavBar />
        </div>
        <div className="flex items-center justify-center w-screen min-h-screen bg-[#0E0E10] pt-24">
          <div className="absolute z-20">

            <div className="text-center text-white">
              <h1 className="text-5xl font-medium font-sans">Build Your Dream Website</h1>
              
              <p className="text-white font-light text-md mt-4 mb-8 font-sans">
                Build beautifully. Effortlessly.
              </p>

              <div className="relative inline-block bg-black">
                <input
                  type="text"
                  className="px-24 py-12 rounded-lg text-white bg-[#333333] bg-opacity-50 text-md font-light border-2 border-[#333333]"
                  placeholder="How can Zentra help you....."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="relative w-full min-h-screen bg-[#0E0E10] flex flex-col items-center px-4 py-12">
        <div className="flex flex-wrap justify-center gap-8 max-w-5xl">
          {[
            { title: "Build a mobile app", image: "/mobileapp.jpeg" },
            { title: "Start a blog", image: "/blog.jpg" },
            { title: "Create a docs site", image: "/docs.jpeg" },
            { title: "Make a dashboard with charts", image: "/dashboard.jpeg" },
            { title: "Responsive Design Out of Box", image: "/responsiveness.jpeg" },
            { title: "Live Code Preview", image: "/livecode.jpeg" }
          ].map(({ title, image }, index) => (
            <div
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(null)}
              key={index}
              className="w-[280px] h-[280px] text-white rounded-2xl shadow-md p-6 flex items-center justify-center text-center text-lg font-normal transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",

              }}>
              <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${hover === index ? "bg-opacity-50" : "bg-opacity-0"}`}></div>
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 text-white text-center px-4 text-lg font-normal z-10 ${hover === index ? 'opacity-100' : 'opacity-0'}`}>
                {title}
              </div>
            </div>
          ))}
        </div>


        <footer className="w-full text-center py-4 text-sm text-gray-400 border-t border-gray-700 mt-12">
          <div className="text-center text-white text-sm py-6">
            <p className="font-normal">Lumigow</p>
            
          </div>
        </footer>



      </div>
    </div>
  );
};
