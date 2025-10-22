import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import  Send  from "../symbols/Send";
import  MonacoViewer  from "../smallCom/MonacoViewer";
import { generatePythonPreview, generateReactPreview, generateUniversalPreview } from "../preview";
import { Check, Copy } from "lucide-react";
import { LoaderFive } from "./ui/loader";

const knownTechnologies = [
  "html", "css", "javascript", "react", "vue", "angular",
  "tailwind", "bootstrap", "node", "express", "mongodb",
  "next", "java", "python", "typescript"
];

type FileType = {
  name: string;
  code: string;
  lang?: string;
};

type ResultType = {
  files?: FileType[];
  explanation?: string;
  requirements?: string[];
};

export default function SearchElement(){
  function extractOf(promptHistory: string[]): string[] {
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
  const { prompt: initialPromptParam } = useParams<{ prompt?: string }>();
  const initialPrompt = initialPromptParam ?? "";

  const [promptInput, setPromptInput] = useState<string>("");
  const [promptHistory, setPromptHistory] = useState<string[]>(initialPrompt ? [initialPrompt] : []);
  const [data, setData] = useState<ResultType | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [tab, setTab] = useState<"code" | "preview">("code");
  const [explanation, setExplanation] = useState<string>("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [copy, setCopy] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>("");

  const backendUrl = (import.meta as any).env?.BACKEND_URL as string | undefined;

  const fetchData = async (combinedPrompt: string) => {
    try {
      const techs = extractOf([combinedPrompt]);
      const language = getPrimaryLanguage(techs);

      if (!backendUrl) {
        console.error("BACKEND_URL is not defined");
        alert("Backend URL not configured.");
        return;
      }

      const res = await axios.post<ResultType>(`${backendUrl}/template`, { prompt: combinedPrompt });
      const result = res.data;
      setData(result);

      if (result.files && result.files.length > 0) {
        setSelectedFile(result.files[0]);
        let generatedPreviewHtml = "";

        if (language === "react") {
          generatedPreviewHtml = generateReactPreview(result.files);
        } else if (language === "python") {
          generatedPreviewHtml = generatePythonPreview(result.files.map(f => f.code).join("\n"));
        } else {
          generatedPreviewHtml = generateUniversalPreview(result.files, language as any);
        }

        setPreviewHtml(generatedPreviewHtml);
      }

      setExplanation(result.explanation || "");
      setRequirements(result.requirements || []);
    } catch (error) {
      console.error("Axios request failed:", error);
      alert("Failed to fetch data from backend.");
    }
  };

  useEffect(() => {
    if (initialPrompt) {
      fetchData(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrompt = () => {
    const input = promptRef.current?.value.trim() || "";
    setPromptInput(input);
    if (input) {
      const updatedHistory = [...promptHistory, input];
      setPromptHistory(updatedHistory);
      const fullPrompt = updatedHistory.join("\n");
      fetchData(fullPrompt);
      if (promptRef.current) promptRef.current.value = "";
    }
  };

  if (!data) return (
    <div className="mt-0 bg-[#0E0E10] relative top-0 w-screen h-screen text-white text-xl flex justify-center items-center space-x-6">
      <LoaderFive text="Generating code..." />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] min-h-screen lg:h-screen">
      <div className="flex flex-col bg-[#0E0E10] shadow p-4 overflow-hidden lg:overflow-auto">
        <div className="flex gap-4 mb-4">
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
              <div className="w-1/5 overflow-auto bg-[#242424] shadow-2xl">
                {data.files?.map((file: FileType) => (
                  <div
                    key={file.name}
                    className={`p-2 cursor-pointer ${selectedFile?.name === file.name ? "bg-[#333333] text-white" : "text-white"}`}
                    onClick={() => setSelectedFile(file)}
                  >
                    {file.name}
                  </div>
                ))}
              </div>

              <div className="flex-1 p-2 overflow-auto relative bg-[#242424] rounded">
                <button
                  onClick={() => {
                    if (selectedFile?.code) {
                      navigator.clipboard.writeText(selectedFile.code);
                      setCopy(prev => !prev);
                    }
                  }}
                  className="absolute top-2 right-2 bg-[#333333] px-2 py-1 rounded bg-opacity-50"
                  title="Copy to clipboard"
                >
                  {copy ? (
                    <div className="flex items-center space-x-2">
                      <Check size={14} />
                      copied
                    </div>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
                <pre className="pt-6 whitespace-pre-wrap">
                  {selectedFile?.code && (
                    <MonacoViewer
                      code={selectedFile.code}
                      language={selectedFile.lang || "plaintext"}
                    />
                  )}
                </pre>
              </div>
            </div>
          ) : (
            <iframe
              srcDoc={previewHtml}
              ref={iframeRef}
              title="Preview"
              className="w-full h-full border-0 rounded"
              sandbox="allow-scripts"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col bg-[#0E0E10] text-white p-6 overflow-hidden lg:overflow-auto">
        <div className="flex-1 overflow-auto">
          <h2 className="text-xl font-bold mb-4">Explanation</h2>
          <p className="text-sm whitespace-pre-wrap">{explanation}</p>

          <div className="flex justify-end mt-4">
            <div className="text-right py-2 p-2 rounded-lg shadow-xl">
              {promptInput}
            </div>
          </div>

          {requirements.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-6 mb-2">Requirements</h3>
              <ul className="list-disc list-inside text-sm">
                {requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="mt-6 flex gap-4 items-center">
          <input
            type="text"
            className="flex-1 px-4 py-3 bg-[#333333] shadow-lg rounded-xl"
            placeholder="How can I help you ?"
            ref={promptRef}
          />
          <button onClick={handlePrompt} aria-label="send prompt">
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};
