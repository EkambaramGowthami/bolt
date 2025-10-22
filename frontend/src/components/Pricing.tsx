import { ChevronDown, ChevronUp, X } from "lucide-react"
import { Profile } from "../symbols/Profile";

import { useEffect, useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { Free } from "../card/Free";
import { Pro } from "../card/Pro";
import { Teams } from "../card/Teams";
import { useNavigate } from "react-router-dom";


export const Pricing = () => {
    const [on, setOn] = useState(false);
    const [first,setFirst]=useState(false);
    const [second,setSecond]=useState(false);
    const [third,setThird]=useState(false);
    const [fourth,setFourth]=useState(false);
    const [fifth,setFifth]=useState(false);
    const [six,setSix]=useState(false);
    const [seven,setSeven]=useState(false);
    const navigate = useNavigate ();
    const [username,setUsername]=useState<string | null>(null);
    const handleCancel = (e : any) => {
        e.preventDefault();
        navigate("/dashboard");
      };
    useEffect(()=>{
        const storedUsername = localStorage.getItem("username");
        setUsername(storedUsername);

    },[]);
    return (
        <div className="bg-black bg-opacity-90 w-full h-full p-12">
            <div className="flex justify-end text-white rounded-full text-sm" onClick={handleCancel}>
                <X size={16} />
            </div>

            <div className="text-white text-5xl font-medium flex justify-center">Pricing</div>
            <div className="mt-4 text-gray-500 text-lg font-normal flex justify-center">Start for free. Upgrade as you go.</div>
            <div className="px-full py-6 shadow-lg text-white font-light flex justify-center items-center border border-gray-500 mt-4 rounded-lg">
                <span className="text-xl font-normal mr-2"> You have 696K</span>tokens left.
            </div>
            <div className="mt-4">
                <div className="text-gray-500 text-md font-light">Current workspace:</div>
                <div className="flex justify-between">
                    <div className="flex text-white flex items-center gap-2">
                        <div><Profile /></div>
                        <div>{username}</div>
                    </div>
                    <div>
                        <div className="flex gap-2">{
                            on ? <div></div> :
                        
                            <button className="px-1 text-white text-sm bg-green-500 rounded-lg" >Save 10%</button>}
                            <div className="text-white font-thin flex items-center">Annual billing</div>
                            <div onClick={() => setOn(!on)} className="cursor-pointer text-white text-3xl">
                                {on ? <ToggleRight className="text-blue-500" size={46} /> : <ToggleLeft className="text-gray-500" size={46} />}
                            </div>

                        </div>
                     </div>
                </div>
                <div className="text-white mt-2 flex flex-col sm:flex-col md:flex-row gap-4">
                    <Free />
                    <Pro on={on} />
                    <Teams on={on} />
                    
                </div>
                <div className="mt-90 text-center space-y-12 p-32">
                            <div className="text-white text-2xl font-medium">Frequently asked questions</div>
                            <div className="text-gray-500 text-lg font-normal">Everything you need to know about the product and billing.</div>
                            <div className="shadow-xl rounded-lg">
                                <div className="flex items-center" >
                                    {first ? <div className="shadow-2xl p-4">
                                        <div className="flex text-lg text-white font-normal items-center"><ChevronUp size={24} /><div onClick={() => setFirst(!first)}>What are tokens?</div></div>
                                        <div className="text-sm text-gray-500 mt-2 text-left">AI tokens are a complex topic related to all AI apps, not just Bolt. You can learn more about tokens here. For Bolt specifically it is important to know that most token usage is related to syncing your project’s file system to the AI: the larger the project, the more tokens used per message. Our top priority is to increase the efficiency of token usage in Bolt. We continue to make improvements so that Bolt uses fewer tokens.

                                        </div></div>
                                        : <div className="flex items-center text-lg text-white font-normal"><ChevronDown size={24} /><div onClick={() => setFirst(!first)}>What are tokens?</div></div>
                                        }
                                    
                                </div>
                             </div>
                             <div className="shadow-xl rounded-lg">
                                <div className="flex items-center" >
                                    {second ? <div className="shadow-2xl p-4">
                                        <div className="flex text-lg text-white font-normal items-center"><ChevronUp size={24} /><div onClick={() => setSecond(!second)}>How do Teams plans work?</div></div>
                                        <div className="text-sm text-gray-500 mt-2 text-left">Teams provide a shared workspace for users to collaborate on Bolt projects. The subscription cost for Teams is per team member. Each paid team member receives a monthly token allotment based on the subscription tier. Tokens are not shared among team members. You can read more about Teams plans here.

                                        </div></div>
                                        : <div className="flex items-center text-lg text-white font-normal"><ChevronDown size={24} /><div onClick={() => setSecond(!second)}>How do Teams plans work?

                                        </div></div>
                                        }
                                    
                                </div>
                             </div>
                             <div className="shadow-xl rounded-lg">
                                <div className="flex items-center" >
                                    {third ? <div className="shadow-2xl p-4">
                                        <div className="flex text-lg text-white font-normal items-center"><ChevronUp size={24} /><div onClick={() => setThird(!third)}>Do tokens rollover from month to month?</div></div>
                                        <div className="text-sm text-gray-500 mt-2 text-left">Tokens associated with paid subscriptions will roll over starting July 1, 2025. Please stay tuned for more information.
                                        </div></div>
                                        : <div className="flex items-center text-lg text-white font-normal"><ChevronDown size={24} /><div onClick={() => setThird(!third)}>Do tokens rollover from month to month?

                                        </div></div>
                                        }
                                    
                                </div>
                             </div>
                             <div className="shadow-xl rounded-lg">
                                <div className="flex items-center" >
                                    {fourth ? <div className="shadow-2xl p-4">
                                        <div className="flex text-lg text-white font-normal items-center"><ChevronUp size={24} /><div onClick={() => setFourth(!fourth)}>
How do token reloads work?</div></div>
                                        <div className="text-sm text-gray-500 mt-2 text-left">If you need more tokens, the most cost-effective option is to upgrade to a higher-tier plan. Alternatively, if you're already on a paid subscription, you can purchase additional tokens by going to Settings  Tokens  Reload Tokens

Please note that reload tokens will roll over month to month, but they can’t be used on a free or Team plan.
                                        </div></div>
                                        : <div className="flex items-center text-lg text-white font-normal"><ChevronDown size={24} /><div onClick={() => setFourth(!fourth)}>
                                        How do token reloads work?

                                        </div></div>
                                        }
                                    
                                </div>
                             </div>
                             <div className="shadow-xl rounded-lg">
                                <div className="flex items-center" >
                                    {fifth? <div className="shadow-2xl p-4">
                                        <div className="flex text-lg text-white font-normal items-center"><ChevronUp size={24} /><div onClick={() => setFifth(!fifth)}>Can I change my plan later?</div></div>
                                        <div className="text-sm text-gray-500 mt-2 text-left">Yes, you can change your plan by clicking Manage current plan. This will take you to our Stripe billing portal where you can select Update subscription to change your plan type.
                                        </div></div>
                                        : <div className="flex items-center text-lg text-white font-normal"><ChevronDown size={24} /><div onClick={() => setFifth(!fifth)}>Can I change my plan later?
                                        </div></div>
                                        }
                                    
                                </div>
                             </div>
                             <div className="shadow-xl rounded-lg">
                                <div className="flex items-center" >
                                    {six? <div className="shadow-2xl p-4">
                                        <div className="flex text-lg text-white font-normal items-center"><ChevronUp size={24} /><div onClick={() => setSix(!six)}>
Can I cancel my subscription?</div></div>
                                        <div className="text-sm text-gray-500 mt-2 text-left">Yes, you can cancel at any time. Click Manage current plan to be taken into the cancellation process.
                                        </div></div>
                                        : <div className="flex items-center text-lg text-white font-normal"><ChevronDown size={24} /><div onClick={() => setSix(!six)}>
                                        Can I cancel my subscription?
                                        </div></div>
                                        }
                                    
                                </div>
                             </div>
                             <div className="shadow-xl rounded-lg">
                                <div className="flex items-center" >
                                    {seven? <div className="shadow-2xl p-4">
                                        <div className="flex text-lg text-white font-normal items-center"><ChevronUp size={24} /><div onClick={() => setSeven(!seven)}>What are the token limits associated with a free plan?</div></div>
                                        <div className="text-sm text-gray-500 mt-2 text-left">What are the token limits associated with a free plan?
                                        </div></div>
                                        : <div className="flex items-center text-lg text-white font-normal"><ChevronDown size={24} /><div onClick={() => setSeven(!seven)}>
                                        What are the token limits associated with a free plan?
                                        </div></div>
                                        }
                                    
                                </div>
                             </div>

                </div>
            </div>
        </div>

    )
}