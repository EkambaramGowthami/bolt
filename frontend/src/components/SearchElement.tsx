import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Send } from "../symbols/Send";
import {
  generateHtmlPreview,
  generateCSSPreview,
  generateJavaScriptPreview,
  generateReactPreview,
  generateVuePreview,
  generateJavaPreview,
} from "../preview";
import { Copy } from "lucide-react";

const knownTechnologies = [
  "html", "css", "javascript", "react", "vue", "angular",
  "tailwind", "bootstrap", "node", "express", "mongodb",
  "next", "java", "python", "typescript"
];

export const SearchElement = () => {
function extractOf(promptHistory:any){
  const fullPrompt = promptHistory.join("\n");
  const lowerPrompt = fullPrompt.toLowerCase();
  return knownTechnologies.filter(tech => lowerPrompt.includes(tech));

}
function getPrimaryLanguage(techs: string[]): string {
  const set = new Set(techs);

  if (set.has("html") && set.has("css") && set.has("javascript")) {
    return "html";
  }

  const priority = ["react", "vue", "angular", "javascript", "html", "java"];
  for (const lang of priority) {
    if (set.has(lang)) return lang;
  }

  return techs[0] || "html";
}


  
  
  const promptRef = useRef<HTMLInputElement>(null);
  let { prompt: initialPrompt } = useParams();
  const [promptInput,setPromptInput] = useState("");
  const [promptHistory,setPromptHistory] = useState([initialPrompt]);
  const [data, setData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tab, setTab] = useState("code");
  const [pre, setPre] = useState("");
  const [explanation, setExplanation] = useState("");
  const [requirements, setRequirements] = useState([]);




    const fetchData = async (combinedPrompt:any) => {
    
      try {
        const techs=extractOf([combinedPrompt]);
        const language = getPrimaryLanguage(techs);
        
        const res = await axios.post("http://localhost:3000/template", { prompt:combinedPrompt });
        setData(res.data);
        console.log(res.data);

        if (res.data.files && res.data.files.length > 0) {
          setSelectedFile(res.data.files[0]);
        }



        let pre2 = "";
        switch (language.toLowerCase()) {
          case "html":
            pre2 = generateHtmlPreview(res.data.files);
            break;
          case "css":
            pre2 = generateCSSPreview(res.data.files);
            break;
          case "javascript":
            pre2 = generateJavaScriptPreview(res.data.files);
            break;
          case "react":
            pre2 = generateReactPreview(res.data.files);
            break;
          case "vue":
            pre2 = generateVuePreview(res.data.files);
            break;
          case "java":
            pre2 = generateJavaPreview(res.data.files);
            break;
          default:
            pre2 = "<p>Preview not supported for this language.</p>";
        }

        setPre(pre2);
        setExplanation(res.data.explanation);
        setRequirements(res.data.requirements || []);
      } catch (error) {
        console.error("Axios request failed:", error);
        alert("Failed to fetch data from backend.");
      }
     
    };
    useEffect(() => {
      if (initialPrompt) {
        fetchData(initialPrompt);
      }
    },[]);
    const handlePrompt = () =>{
      const input=promptRef.current?.value.trim();
      setPromptInput(input);
      if(input){
        const updatedHistory=[...promptHistory,input];
        setPromptHistory(updatedHistory);
        const fullPrompt = updatedHistory.join("\n");
        fetchData(fullPrompt);
        promptRef.current.value="";
      }
  
    }
  
   
 

  if (!data) return <div className="mt-0 bg-[#0E0E10] relative top-0 w-screen h-screen text-white text-xl flex justify-center items-center ">Generating code...</div>;
  
  return (
    <div className="flex h-screen">
      <div className="w-[820px]  shadow p-4 flex flex-col bg-[#0E0E10] ">
        <div className="flex gap-4 mb-4 bg-[#0E0E10]">
          <button
            onClick={() => setTab("code")}
            className={`px-4 py-2 rounded ${tab === "code" ? "bg-blue-600 text-white" : "text-blue-600"}`}
          >
            Code
          </button>
          <button
            onClick={() => setTab("preview")}
            className={`px-4 py-2 rounded ${tab === "preview" ? "bg-blue-600 text-white" : "text-blue-600"}`}
          >
            Preview
          </button>
        </div>

        <div className="flex-1 overflow-auto border-0 rounded shadow-2xl border-l-4 border-l-[#333333]">
          {tab === "code" ? (
            <div className="flex h-full">
              <div className="w-1/4 border-0 overflow-auto  bg-opacity-50  shadow-2xl">
                {data?.files?.map((file) => (
                  <div
                    key={file.name}
                    className={`p-2 cursor-pointer text-white ${selectedFile?.name === file.name ? "text-white  bg-[#333333] bg-opacity-50 rounded " : "text-white"}`}
                    onClick={() => setSelectedFile(file)}
                  >
                    {file.name}
                  </div>
                ))}
              </div>

              <div className="text-white bg-black w-full p-2 overflow-auto relative">

                <button
                  onClick={() => {
                    if (selectedFile?.code) {
                      navigator.clipboard.writeText(selectedFile.code);
                      alert("Code copied to clipboard!");
                    }
                  }}
                  className="absolute top-2 right-2 bg-gray-500 bg-opacity-20 text-white px-2 py-1 rounded hover:[#333333] bg-opacity-50"
                  title="Copy to clipboard"
                >
                  
                 <Copy size={12} />
                </button>

                <pre className="text-white p-4 rounded h-full whitespace-pre-wrap">
                  {selectedFile?.code}
                </pre>
              </div>
            </div>
          ) : (
            <iframe
              srcDoc={pre}
              title="Preview"
              className="w-full h-full border-0 rounded "
              sandbox="allow-scripts"
            >
              Your browser does not support iframes.
            </iframe>
            
          )}

        </div>

      </div>
      <div className="flex-1 bg-black text-white p-4 overflow-auto relative ">
        <div className="mt-12">
        
          
          <h2 className="text-xl font-bold mb-4">🧠 Explanation</h2>
          <p className="text-sm whitespace-pre-wrap space-y-2 ">{explanation}</p>
          <div className="flex justify-end">
            <div className="text-right py-2 p-2 rounded-lg shadow-xl">{promptInput}</div>
          </div>

          {requirements.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-6 mb-2">⚙️ Requirements</h3>
              <ul className="list-disc list-inside text-sm">
                {requirements.map((req, index) => (
                  <li key={index} className="mb-1">{req}</li>
                ))}
              </ul>
            </>
          )}
          

        </div>

        <div className="mt-96 flex gap-8 items-center">
          <input type="text" className="px-12 py-4 bg-[#0E0E10] shadow-lg rounded-xl" placeholder="How can I help you ?"  ref={promptRef} />
          <div onClick={handlePrompt}><Send /></div>
        </div>
      </div>

    </div>
  );
};
