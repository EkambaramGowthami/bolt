export const Free = () =>{
    return (
        <div className="w-[480px] h-[500px] shadow-2xl border border-gray-700 rounded-lg">
            <div className="p-8">
                <p className="text-white text-2xl font-medium">Free</p>
                <p className="text-white font-light text-sm">Explore core features at no cost — perfect for light, personal projects.</p>
            </div>
            <hr className="border border-gray-700 w-full"/>
            <div className="px-full py-6 text-white text-center">
               <p className="font-semibold text-4xl">$0</p>
               <p className="font-light text-md">never billed</p>
            </div>
            <hr className="border border-gray-700 w-full"/>
            <div className="p-4">
                <div className="text-white font-light text-md">Monthly tokens</div>
                <div className="flex justify-between mt-2">
                    <div className="text-xl text-white font-medium">1M tokens/Month</div>
                    <div className="text-md text-white font-light">150K daily limit</div>

                </div>
                <div className="bg-gray-500 bg-opacity-20 text-white rounded text-center text-md font-light px-12 py-2 mt-4">Your current plan</div>
            </div>
            <hr className="border border-gray-700 w-full"/>
            <div className="p-4">
                <div className="text-lg text-white font-normal">You get:</div>
                <div className="text-md text-white font-light mt-2">Public and private projects</div>

            </div>

        </div>
    )
}