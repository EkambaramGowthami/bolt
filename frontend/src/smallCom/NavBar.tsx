import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

export const NavBar = ({setApp}:any) => {
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
  return <div className="relative top-6 left-0 bg-black w-full">
    <nav className="flex text-white items-center">
      <div className="absolute left-6 flex jusgap-1 text-3xl font-medium">
        <span className="flex items-center">
          <span>𝐙entra</span></span>

      </div>
      <div className="w-full text-gray-500 absolute left-[520px] text-center flex space-x-4 text-md font-light">
        <span className="hover:text-white hover:bg-[#333333] bg-opacity-50 rounded-lg pt-1 pb-1 pl-2 pr-2" onClick={() => navigate("/dashboard/pricing")}>Pricing</span>
        <span className="hover:text-white hover:bg-[#333333] bg-opacity-50 rounded-lg pt-1 pb-1 pl-2 pr-2" onClick={()=>setApp(true)}>Apps</span>
        <span className="hover:text-white hover:bg-[#333333] bg-opacity-50 rounded-lg pt-1 pb-1 pl-2 pr-2" onClick={() => window.location.reload()}>Start a new chart</span>
      </div>

     
        {
          username != null ? (
            username &&
            <div className="absolute right-12 flex space-x-4">
              <button className="text-md hover:bg-[#333333] bg-opacity-50 px-2 py-1 rounded" onClick={handleLogout}>Sign out</button>
              <div className="bg-white text-black text-md rounded-lg pt-1 pb-1 pl-2 pr-2">Hi {username}</div>
            </div>
          ) : (
            <div className="absolute right-12 flex space-x-4">
              <button className="text-md hover:bg-[#333333] bg-opacity-50 px-2 py-1 rounded" onClick={() => navigate("/login")}>Login</button>
              <button className="bg-white rounded-lg text-md px-4 py-1 text-black" onClick={() => navigate("/signup")}>Signup</button>
            </div>



          )
        }


      

    </nav>

  </div>
}