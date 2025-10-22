import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
export default function Teams({ on }: any){
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState(["30","27"]);
    const [input,setInput]=useState("10M/month");
    const menuItems = {
        "10M/month": ["30", "27"],
        "26M/month": ["60", "55"],
        "55M/month": ["110", "100"],
        "120M/month": ["200", "180"],
        "180M/month": ["300", "270"],
        "240M/month": ["400", "360"],
        "300M/month": ["500", "450"]
    };
    const handleTeam = async () =>{
        const userId=localStorage.getItem("userId");
        const amount = on ? item[1] : item[0];
        const response = await axios.post("http://localhost:3000/buy",{
            userId,
            amount
        })
        console.log(response.data.tokens);
    }
    return (
        <div className="md:w-1/3 sm:w-full h-[500px] border border-gray-700 shadow-lg rounded-lg">
            <div className="p-8">
                <div className="flex justify-center items-center gap-2">
                    <div className="text-2xl text-white font-semibold">Teams</div>
                   
                </div>
                <p className="text-white font-light text-sm">Role based access with one consolidated management for your whole team.</p>
            </div>
            <hr className="border border-gray-700 w-full" />
            <div className="px-full py-6 text-white text-center">
                <p >{on ? <div><div className="font-medium text-4xl">${item[0]}</div><div>Billed yearly</div></div> : <div><div className="font-medium text-4xl">${item[1]}</div><div>Billed monthly</div></div>}</p>

            </div>
            <hr className="border border-gray-700 w-full" />
            <div className="p-4">
                <div className="text-white font-light text-md">Get more tokens for members</div>
                <div className="flex justify-between mt-2 bg-gray-500 bg-opacity-20 px-full py-2 p-2">
                    <div className="text-white text-lg font-medium">{input}</div>
                    <div className="text-white" onClick={() => setOpen(!open)}>{open ? <ChevronUp /> : <ChevronDown />}</div>

                    {open && (
                        <div className="absolute mt-12 w-72 bg-black text-white shadow-lg rounded-md z-10">
                            {Object.entries(menuItems).map(([label, values]) => (
                                <div
                                    key={label}
                                    className="flex justify-between px-4 py-2 text-white hover:bg-gray-600 bg-opacity-20 cursor-pointer"
                                    onClick={() => {
                                        setItem(values);
                                        setInput(label);
                                        setOpen(false);
                                    }}
                                >
                                    <div>{label}</div>
                                 </div>
                            ))}
                        </div>
                    )}
                </div>
                <button className="text-white font-normal bg-blue-500 rounded-lg w-full py-2 mt-4 hover:bg-sky-500" onClick={handleTeam}>Create a new team</button>
            </div>
            <hr className="border border-gray-700 w-full" />
            <div className="p-4">
                <p className="text-white font-normal"> You get everything in Pro, plus:</p>
                <div className="text-white font-light text-sm">
                    <p> ✔ Centralized billing</p>
                    
                </div>
            </div>


        </div>
    )
}