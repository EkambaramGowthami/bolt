import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

export const NavBar = ({ setApp }: any) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    console.log(storedUsername);
    setUsername(storedUsername);

  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);

  }
  return (
    <div className="relative top-6 left-0 w-full overflow-x-auto pb-4">
      <nav className="flex items-center justify-between text-white px-4 py-3 min-w-max gap-2">
        
        <div className="flex text-2xl font-medium shrink-0">
          <span className="flex items-center">
            <span>𝐙entra</span>
          </span>
        </div>
  
        
        <div className="flex text-gray-500 text-sm space-x-4 text-md font-light shrink-0">
          <span
            className="hover:text-white hover:bg-[#333333] bg-opacity-50 rounded-lg pt-1 pb-1 pl-2 pr-2 cursor-pointer"
            onClick={() => navigate("/dashboard/pricing")}
          >
            Pricing
          </span>
          <span
            className="hover:text-white hover:bg-[#333333] bg-opacity-50 rounded-lg pt-1 pb-1 pl-2 pr-2 cursor-pointer"
            onClick={() => setApp(true)}
          >
            Apps
          </span>
          <span
            className="hover:text-white hover:bg-[#333333] bg-opacity-50 rounded-lg pt-1 pb-1 pl-2 pr-2 cursor-pointer"
            onClick={() => window.location.reload()}
          >
            Start a new chart
          </span>
        </div>
  
        
        <div className="flex items-center space-x-3 mt-2 md:mt-0 shrink-0">
          {username ? (
            <>
              <button
                className="text-sm sm:text-md hover:bg-[#333333] px-3 py-1 rounded"
                onClick={handleLogout}
              >
                Sign out
              </button>
              <div className="bg-white text-black text-sm sm:text-md rounded-lg px-3 py-1">
                Hi {username}
              </div>
            </>
          ) : (
            <>
              <button
                className="text-sm sm:text-md hover:bg-[#333333] px-3 py-1 rounded"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="bg-white text-black text-sm sm:text-md rounded-lg px-4 py-1"
                onClick={() => navigate("/signup")}
              >
                Signup
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
  

}