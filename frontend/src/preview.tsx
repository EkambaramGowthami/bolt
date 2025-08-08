
import { transform } from "@babel/standalone";

type File = { name: string; code: string };
type LangType = "react" | "vue" | "tailwind" | "html" | "java" | "unknown";

function isImage(name: string) {
  return /\.(png|jpe?g|gif|svg|webp)$/i.test(name);
}

function getImageUrl(name: string, files: File[]) {
  const file = files.find(f => f.name === name);
  return file ? `data:image/${name.split(".").pop()};base64,${file.code}` : "";
}

export function generateUniversalPreview(
  files: File[],
  detectedType: LangType
): string {
  const get = (ext: string) =>
    files.find(f => f.name.endsWith(ext))?.code || "";

  const css = get(".css");
  const js = get(".js");
  const html = get(".html");
  const jsxFile = files.find(
    f => f.name.endsWith(".jsx") || f.name.endsWith(".tsx")
  );

  switch (detectedType) {
    
   
    
      case "vue": {
        const vueFile = files.find(f => f.name.endsWith(".vue"));
        let templateCode = "";
        let scriptCode = "";
        let styleCode = "";
        
        if (vueFile) {
          const templateMatch = vueFile.code.match(/<template>([\s\S]*?)<\/template>/);
          const scriptMatch = vueFile.code.match(/<script[^>]*>([\s\S]*?)<\/script>/);
          const styleMatch = vueFile.code.match(/<style[^>]*>([\s\S]*?)<\/style>/);
        
          templateCode = templateMatch ? templateMatch[1].trim() : "";
          scriptCode = scriptMatch ? scriptMatch[1].trim() : "";
          styleCode = styleMatch ? styleMatch[1].trim() : "";
        
          if (/export\s+default/.test(scriptCode)) {
            scriptCode = scriptCode.replace(/export\s+default/, "window.App = ");
          } else if (vueFile.code.includes("<script setup")) {
            return `<html><body><pre style="color:red;">⚠️ &lt;script setup&gt; is not supported in preview. Please use &lt;script&gt; with export default.</pre></body></html>`;
          } else {
            scriptCode = "window.App = {}";
          }
          
          templateCode = templateCode.replace(/`/g, '\\`');
          scriptCode += `;\nif(window.App){ window.App.template = \`${templateCode}\`; }`;
        } else {
          return `<html><body><pre style="color:red;">No .vue file found.</pre></body></html>`;
        }
        console.log("Script Code:", scriptCode);


        return `
        <!DOCTYPE html>
        <html>
          <head>
            <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
            <style>${styleCode}</style>
          </head>
          <body>
            <div id="app"></div>
            <script>
              (function(){
                // Fallback for defineComponent-based exports
                const defineComponent = (comp) => comp;
        
                ${scriptCode}
              })();
        
              if (typeof window.App !== 'undefined') {
                Vue.createApp(window.App).mount("#app");
              } else {
                document.body.innerHTML = '<pre style="color:red;">App component not defined.</pre>';
              }
            <\/script>
          </body>
        </html>
        `;
        
    }

    
    
    
    
    
    case "tailwind": {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>${css}</style>
          </head>
          <body class="p-4">
            ${html}
            <script>${js}</script>
          </body>
        </html>`;
    }

    case "html": {
      const imgTags = files
        .filter(f => isImage(f.name))
        .map(
          f =>
            `<img src="${getImageUrl(f.name, files)}" alt="${f.name}" style="max-width: 200px; margin: 10px;" />`
        )
        .join("");

      return `
        <!DOCTYPE html>
        <html>
          <head><style>${css}</style></head>
          <body>
            ${html}
            ${imgTags}
            <script>${js}</script>
          </body>
        </html>`;
    }

    case "java": {
      const javaOutput =
        files.find(f => f.name.endsWith(".java"))?.code || "No output";
      return `
        <!DOCTYPE html>
        <html>
          <body>
            <h3>Java Output:</h3>
            <pre style="background:#f0f0f0; padding:10px">${javaOutput}</pre>
          </body>
        </html>`;
    }

    default:
      return `<html><body><pre>No preview available</pre></body></html>`;
  }
}




export function generateReactPreview(files: File[]): string {
  const jsxFile = files.find(f => f.name.endsWith(".tsx") || f.name.endsWith(".jsx"));
  const cssFile = files.find(f => f.name.endsWith(".css"));
  const css = cssFile?.code || "";

  if (!jsxFile) return "Missing React file";
  let userCode = jsxFile.code.replace(/^import\s.+;?\n?/gm, "");
  userCode = userCode.replace(/export\s+default\s+/gm, "const App = ");
  userCode = userCode.replace(/\b(useState|useEffect|useRef|useMemo|useCallback|useContext|useReducer|useLayoutEffect|useImperativeHandle|useTransition|useDeferredValue)\b/g, "React.$1");

  let transpiledCode = "";
  try {
    transpiledCode = transform(userCode, {
      presets: ["typescript", "react"],
      filename: "App.tsx",
    }).code || "";
  } catch (err) {
    return `<pre style="color:red;">Babel Error: ${err}</pre>`;
  }

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>React Preview</title>
    <style>${css}</style>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script>
      try {
        ${transpiledCode}
        ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
      } catch (e) {
        document.body.innerHTML = '<pre style="color:red;">' + e + '</pre>';
      }
    </script> 
  </body>
</html>
`;
}

export function generatePythonPreview(code: string): string {
  const escapedCode = code.replace(/`/g, '\\`');

  return `
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"></script>
    <style>
      body { font-family: sans-serif; padding: 20px; }
      #output { white-space: pre-wrap; background: #111; color: #0f0; padding: 10px; margin-top: 10px; border-radius: 6px; }
    </style>
  </head>
  <body>
    <h3>Python Preview</h3>
    <div id="output">Running...</div>
    <script>
      async function main() {
        const pyodide = await loadPyodide();
        try {
          const output = await pyodide.runPythonAsync(\`${escapedCode}\`);
          document.getElementById("output").textContent = output !== undefined ? output : "Executed successfully (no output)";
        } catch (err) {
          document.getElementById("output").textContent = " Error:\\n" + err;
        }
      }
      main();
    <\/script>
  </body>
</html>
`;
}

