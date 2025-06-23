import { useState } from "react";

export const DisplayArea = ({ files, previewHTML }) => {
  const [tab, setTab] = useState("preview");
  const [selectedFile, setSelectedFile] = useState(files[0]?.name);

  return (
    <div className="mt-4">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab("preview")} className="px-4 py-2 bg-gray-200 rounded">
          Preview
        </button>
        <button onClick={() => setTab("code")} className="px-4 py-2 bg-gray-200 rounded">
          Code
        </button>
      </div>

      {tab === "preview" ? (
        <iframe
          title="preview"
          srcDoc={previewHTML}
          className="w-full h-[500px] border"
        />
      ) : (
        <div className="flex border rounded overflow-hidden">
          <div className="w-1/4 border-r">
            {files.map(file => (
              <div
                key={file.name}
                className={`p-2 cursor-pointer ${selectedFile === file.name ? "bg-gray-300" : ""}`}
                onClick={() => setSelectedFile(file.name)}
              >
                {file.name}
              </div>
            ))}
          </div>
          <div className="w-3/4 p-4">
            <pre className="bg-black text-white p-4 h-[500px] overflow-auto">
              {files.find(f => f.name === selectedFile)?.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
