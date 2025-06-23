import { ChevronDown,ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

export const NavBar = ({setSignupButton,setSigninButton,setCom,username}:any) =>{
   
    const navigate=useNavigate();
    const [clickR,setClickR]=useState(false);
    const handlePricing = (e) =>{
        e.preventDefault();
        navigate(`/pricing/${encodeURIComponent(username)}`);
    }
    const handleCom = (e) =>{
        e.preventDefault();
        setCom(true);
        
    }
    
    return (
        <nav className="flex justify-between bg-black">
            <div className="italic text-3xl ml-4 font-bold text-white">bolt</div>
            <div className="hidden md:flex text-lg font-light text-gray-500 space-x-6 items-center gap-6">
                <a href="/" className='hover:text-white ' onClick={handleCom}>Community</a>
                {/* <div className="flex items-center hover:text-white ">
                    <a href="/" onClick={() => setClickR(true)} onMouseLeave={()=>setClickR(false)}>Resources</a>
                    <span>{clickR ? <ChevronUp/>  : <ChevronDown />}</span>
                </div> */}
                <a href="/" className='hover:text-white' onClick={handlePricing}>Pricing</a>
            </div>
            <div className='mr-8'>
                <button className='text-white px-6 py-1 top-2 rounded bg-blue-500 mr-4' onClick={()=>setSignupButton(true)}>signup</button>
                <button className='text-white px-6 py-1 top=2 rounded border border-blue-500 ' onClick={()=>setSigninButton(true)}>signin</button>
            </div>
        </nav>
    )
}