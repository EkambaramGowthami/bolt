import { Gift, Group, Settings } from "lucide-react"
import { Chat } from "../symbols/Chat"
import { Help } from "../symbols/Help"
import { SubScription } from "../symbols/SubScription"
import { LogOut } from "lucide-react";
import { Profile } from "../symbols/Profile";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const SideBar = ({ hover, setHover, username,setgetToken}:any) => {

   const navigate=useNavigate();
    // const handleSignout = async () => {
    //     const token = localStorage.getItem("token");
    //    const response = await axios.delete("http://localhost:3000/signout", {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     });
    //     alert("your signed out")


    // }
    const handleSub = (e) =>{
        e.preventDefault()
        navigate(`/pricing/${encodeURIComponent(username)}`);

    }
    const handleLogout = () => {
        localStorage.removeItem("token");
        //setUsername(null);
      };
    return (
        <div className="w-80 min-h-screen shadow-lg border border-gray-500 focus border:none rounded-xl fixed  h-full w-80 bg-black text-white p-4 z-30 transition-all" onMouseLeave={() => setHover(false)}>
            <div className="p-4">
                <div className="mt-6 text-white"><input type="text" placeholder="Start a new chat" className="bg-sky-400 bg-opacity-30   px-2 py-2 rounded placeholder:text-blue-500 hover:bg-opacity-40"  onClick={() => {window.location.reload()}}/>
                </div>
                <div className="mt-2">
                    <input type="text" placeholder="Search" className="bg-black px-2 py-2 text-gray-500 shadow-lg  border border-gray-500 focus:outline-none  rounded-xl" />
                </div>
                <div className="text-white">
                    <p className="font-light mt-4">Your chats</p>
                    <p className="text-gray-500 font-light mt-4">today</p>
                    <p className="mt-2 text-gray-500 font-md hover:bg-gray-900 bg-opacity-20 rounded mt-4">Production ready todo application</p>
                </div>
            </div>

            <hr className="w-full border border-gray-500 focus border:none" />
            <div className="p-4 text-md">
                <div className="flex rounded h-12 items-center space-x-4 text-green-500 hover:bg-gray-900 bg-opacity-20" onClick={() => setgetToken(true)}>
                    <div><Gift /></div>
                    <div>Get free tokens</div>
                </div>
                {/* <div className="flex rounded h-12 items-center space-x-4 hover:bg-gray-900 bg-opacity-20">
                    <div><Settings /></div>
                    <div>Settings</div>
                </div> */}
                <div className="flex rounded h-12 items-center space-x-4 hover:bg-gray-900 bg-opacity-20">
                    <div><Help /></div>
                    <div>Help center</div>
                </div>

            </div>
            <hr className="w-full border border-gray-500 focus border:none" />
            <div className="p-4 text-md">
                <div className="flex rounded h-12 items-center space-x-4 hover:bg-gray-900 bg-opacity-20" onClick={handleSub}>
                    <div><SubScription /></div>
                    <div>My Subscription</div>
                </div>
                <div className="flex rounded h-12 items-center space-x-4 hover:bg-gray-900 bg-opacity-20" onClick={handleSub}>
                    <div><Group /></div>
                    <div>Select Account</div>
                </div>
                <div className="flex rounded h-12 items-center space-x-4 hover:bg-gray-900 bg-opacity-20">
                    <div><LogOut /></div>
                    <div onClick={handleLogout}>Log out</div>
                </div>
            </div>
            <hr className="w-full border border-gray-500 focus border:none" />
            <div className="p-2">
                <div className="flex rounded h-12 items-center space-x-4 hover:bg-gray-900 bg-opacity-20">
                    <div><Profile /></div>
                    <div className="text-white font-bold">{username}</div>
                </div>

            </div>

        </div>
    )
}