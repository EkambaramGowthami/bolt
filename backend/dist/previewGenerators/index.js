"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHtmlPreview = generateHtmlPreview;
exports.generateCSSPreview = generateCSSPreview;
exports.generateJavaPreview = generateJavaPreview;
exports.generateJavaScriptPreview = generateJavaScriptPreview;
exports.generateReactPreview = generateReactPreview;
exports.generateVuePreview = generateVuePreview;
function generateHtmlPreview(files) {
    var _a, _b, _c;
    const htmlFile = ((_a = files.find(f => f.name.endsWith('.html'))) === null || _a === void 0 ? void 0 : _a.content) || '';
    const cssFile = ((_b = files.find(f => f.name.endsWith('.css'))) === null || _b === void 0 ? void 0 : _b.content) || '';
    const jsFile = ((_c = files.find(f => f.name.endsWith('.js'))) === null || _c === void 0 ? void 0 : _c.content) || '';
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${cssFile}</style>
    </head>
    <body>
      ${htmlFile}
      <script>${jsFile}</script>
    </body>
    </html>
  `;
}
function generateCSSPreview(files) {
    const cssFile = files.find(f => f.name.endsWith(".css"));
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        ${(cssFile === null || cssFile === void 0 ? void 0 : cssFile.code) || "body { font-family: sans-serif; }"}
      </style>
    </head>
    <body>
      <h1>CSS Preview</h1>
      <p>This is a sample preview with your CSS styles.</p>
    </body>
    </html>
  `;
}
function generateJavaPreview(files) {
    const javaFile = files.find(f => f.name.endsWith(".java"));
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Java Code Preview</title>
      <style>
        pre { background: #1e1e1e; color: #dcdcdc; padding: 1em; border-radius: 8px; }
      </style>
    </head>
    <body>
      <h2>Java Code (Not Executable in Browser)</h2>
      <pre>${(javaFile === null || javaFile === void 0 ? void 0 : javaFile.code) || "No Java code found"}</pre>
    </body>
    </html>
  `;
}
function generateJavaScriptPreview(files) {
    const jsFile = files.find(f => f.name.endsWith(".js"));
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>JavaScript Preview</title>
    </head>
    <body>
      <h1>JavaScript Output (Check Console)</h1>
      <script>
        ${(jsFile === null || jsFile === void 0 ? void 0 : jsFile.code) || 'console.log("No JS code found");'}
      </script>
    </body>
    </html>
  `;
}
function generateReactPreview(files) {
    var _a;
    const jsxFile = files.find(f => f.name.endsWith('.jsx') || f.name.endsWith('.tsx'));
    const cssFile = ((_a = files.find(f => f.name.endsWith('.css'))) === null || _a === void 0 ? void 0 : _a.content) || '';
    let jsxContent = (jsxFile === null || jsxFile === void 0 ? void 0 : jsxFile.content) || '';
    // Ensure App is defined
    const hasAppComponent = /(?:const|function|class)\s+App\s*/.test(jsxContent);
    if (!hasAppComponent) {
        // Wrap the user's code inside a fallback App component
        jsxContent = `
      const App = () => {
        return (
          <div>
            ${jsxContent}
          </div>
        );
      };
    `;
    }
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>${cssFile}</style>
      <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    </head>
    <body>
      <div id="root"></div>
      <script type="text/babel">
        ${jsxContent}
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
      </script>
    </body>
    </html>
  `;
}
function generateVuePreview(files) {
    var _a, _b;
    const vueFile = ((_a = files.find(f => f.name.endsWith('.vue'))) === null || _a === void 0 ? void 0 : _a.content) || '';
    const cssFile = ((_b = files.find(f => f.name.endsWith('.css'))) === null || _b === void 0 ? void 0 : _b.content) || '';
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
      <style>${cssFile}</style>
    </head>
    <body>
      <div id="app"></div>
      <script type="module">
        const { createApp } = Vue;
        ${vueFile}
      </script>
    </body>
    </html>
  `;
}
