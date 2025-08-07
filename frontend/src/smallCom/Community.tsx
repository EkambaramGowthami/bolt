import { Discord } from "../symbols/Discord"
import { Insta } from "../symbols/Inta"
import { LinkedIn } from "../symbols/LinkedIn"
import { Reddit } from "../symbols/Reddit"
import { Twitter } from "../symbols/Twitter"
import { Youtube } from "../symbols/Youtube"

export const Community = () => {
    return (
        <div className="bg-[#333333] bg-opacity-50 shadow-xl text-white font-normal text-md flex gap-4 p-4 rounded-xl">
            <div className="space-y-2 items-center">
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
            <div className="space-y-2 items-center">
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