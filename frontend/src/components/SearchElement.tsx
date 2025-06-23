import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Send } from "../symbols/Send"
import {
  generateHtmlPreview,
  generateCSSPreview,
  generateJavaScriptPreview,
  generateReactPreview,
  generateVuePreview,
  generateJavaPreview,
} from "../preview";
import { Copy } from "lucide-react";



export const SearchElement = () => {
  const language="react";
  
  const promptRef = useRef();
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
        const res = await axios.post("http://localhost:3000/template", { prompt: combinedPrompt, language });
        setData(res.data);


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
        const fullPrompt = updatedHistory.join("/n");
        fetchData(fullPrompt);
        promptRef.current.value="";
      }
  
    }
  
   
 

  if (!data) return <div className="mt-0 bg-black w-screen h-screen text-white text-center mt-10 ">Generating code...</div>;
  
  return (
    <div className="flex h-screen">
      <div className="w-[820px]  shadow p-4 flex flex-col bg-black">
        <div className="flex gap-4 mb-4 bg-black">
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

        <div className="flex-1 overflow-auto border rounded ">
          {tab === "code" ? (
            <div className="flex h-full">
              <div className="w-1/4 border-r overflow-auto bg-gray-600 opacity-50">
                {data.files.map((file) => (
                  <div
                    key={file.name}
                    className={`p-2 cursor-pointer text-white ${selectedFile?.name === file.name ? "text-white  bg-gray-500 bg-opacity-80 " : "text-white"}`}
                    onClick={() => setSelectedFile(file)}
                  >
                    {file.name}
                  </div>
                ))}
              </div>

              <div className="text-white bg-gray-800 bg-opacity-50 w-full p-2 overflow-auto bg-gray-500 bg-opacity-70 relative">

                <button
                  onClick={() => {
                    if (selectedFile?.code) {
                      navigator.clipboard.writeText(selectedFile.code);
                      alert("Code copied to clipboard!");
                    }
                  }}
                  className="absolute top-2 right-2 bg-gray-500 bg-opacity-20 text-white px-2 py-1 rounded hover:bg-gray-600"
                  title="Copy to clipboard"
                >
                  {/* Replace below with <Copy size={16} /> if using lucide-react */}
                  📋
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
              className="w-full h-full border rounded "
              sandbox="allow-scripts"
            >
              Your browser does not support iframes.
            </iframe>
          )}

        </div>

      </div>
      <div className="flex-1 bg-gray-900 text-white p-4 overflow-auto relative ">
        <div className="mt-12">
        
          
          <h2 className="text-xl font-bold mb-4">🧠 Explanation</h2>
          <p className="text-sm whitespace-pre-wrap space-y-2 ">{explanation}</p>
          <div className="flex justify-end">
            <div className="text-right bg-gray-500 bg-opacity-20 py-2 p-2 rounded-lg shadow-xl">{promptInput}</div>
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
          <input type="text" className="px-12 py-4 bg-gray-500 bg-opacity-20 border border-gray-800 shadow-lg rounded-xl" placeholder="How can I help you ?"  ref={promptRef} />
          <div onClick={handlePrompt}><Send /></div>
        </div>
      </div>

    </div>
  );
};
