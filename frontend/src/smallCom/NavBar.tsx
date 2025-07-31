import { useNavigate } from "react-router-dom"

export const NavBar = ()=>{
  const navigate=useNavigate();
  return <div className="relative top-6 left-0 bg-black w-full">
    <nav className="flex text-white items-center">
       <div className="absolute left-6 text-3xl font-medium p-4">
        Zentra
        </div>
      <div className="w-full text-gray-500 absolute left-[520px] text-center flex space-x-4 text-md font-light">
        <span className="hover:text-white" onClick={()=>navigate("/dashboard/pricing")}>Pricing</span>
        <span className="hover:text-white">Features</span>
        <span className="hover:text-white" onClick={()=>window.location.reload()}>Start a new chart</span>
      </div>
      <div className="absolute right-12 flex space-x-4">
        <button className="text-md hover:bg-[#333333] bg-opacity-50 px-2 py-1 rounded" onClick={()=>navigate("/login")}>Login</button>
        <button className="bg-white rounded-lg text-md px-4 py-1 text-black" onClick={()=>navigate("/signup")}>Signup</button>

      </div>

    </nav>

  </div>
}