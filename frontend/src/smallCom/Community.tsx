import { Discord } from "../symbols/Discord"
import { Insta } from "../symbols/Inta"
import { LinkedIn } from "../symbols/LinkedIn"
import { Reddit } from "../symbols/Reddit"
import { Twitter } from "../symbols/Twitter"
import { Youtube } from "../symbols/Youtube"

export const Community = ({setCom}:any) =>{
    return (
        <div className="bg-gray-500 bg-opacity-20 shadow-xl text-white font-normal text-md flex gap-6 p-4 rounded-xl" onMouseLeave={()=>setCom(false)}>
            <div className="space-y-2">
            <div className="text-white flex justify-center items-center gap-2">
                <Discord />
                <p>Discord</p>
               
            </div>
            <div className="text-white flex justify-center items-center gap-2">
                <Youtube />
                <p>Youtube</p>
               
            </div>
            <div className="text-white flex justify-center items-center gap-2">
                <Insta />
                <p>Instagram</p>
               
            </div>

            </div>
           
            <div className="space-y-2">
            <div className="text-white flex justify-center items-center gap-2">
                <LinkedIn />
                <p>LinkedIn</p>
               
            </div>
            <div className="text-white flex justify-center items-center gap-2">
                <Twitter />
                <p>Twitter</p>
               
            </div>
            <div className="text-white flex justify-center items-center gap-2">
                <Reddit />
                <p>Reddit</p>
               
            </div>
            </div>
        </div>
    )
}