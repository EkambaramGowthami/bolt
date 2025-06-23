interface myComponentProps {
    placeholder:string,
    symbol:boolean,
    symbolImage:any
}
export const Button = (values:myComponentProps) =>{
        return (
            <button className="text-gray-400 font-normal text-sm rounded-xl hover:text-white shadow-lg shadow-black border border-gray-500 px-2">
                
                    {values.symbol ? <div className="flex items-center">
                            <span className="mr-2">{values.symbolImage}</span>
                            <span>{values.placeholder}</span>
                        </div> :
                       ( values.placeholder )
                    }
            </button>
        )
}