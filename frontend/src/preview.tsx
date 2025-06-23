export function generateHtmlPreview(files:any[]) {
  const htmlFile = files.find(f => f.name.endsWith('.html'))?.content || '';
  const cssFile = files.find(f => f.name.endsWith('.css'))?.content || '';
  const jsFile = files.find(f => f.name.endsWith('.js'))?.content || '';

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

export function generateCSSPreview(files: any[]) {
  const cssFile = files.find(f => f.name.endsWith(".css"));
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        ${cssFile?.code || "body { font-family: sans-serif; }"}
      </style>
    </head>
    <body>
      <h1>CSS Preview</h1>
      <p>This is a sample preview with your CSS styles.</p>
    </body>
    </html>
  `;
}

export function generateJavaPreview(files: any[]) {
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
      <pre>${javaFile?.code || "No Java code found"}</pre>
    </body>
    </html>
  `;
}

export function generateJavaScriptPreview(files: any[]) {
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
        ${jsFile?.code || 'console.log("No JS code found");'}
      </script>
    </body>
    </html>
  `;
}

export function generateReactPreview(files) {
  const jsxFile = files.find(f => f.name.endsWith(".jsx") || f.name.endsWith(".tsx"));
  const cssFile = files.find(f => f.name.endsWith(".css"))?.content || "";

  const jsxCode = jsxFile?.content || "";

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>${cssFile}</style>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <title>React Preview</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      // Required for Babel to transpile JSX
      const { useState, useEffect } = React;

      ${jsxCode}

      // Try to render App if defined
      if (typeof App !== 'undefined') {
        const root = ReactDOM.createRoot(document.getElementById("root"));
        root.render(<App />);
      } else {
        document.getElementById("root").innerHTML = "<h3>No App component found.</h3>";
      }
    </script>
  </body>
</html>
  `;
}





export function generateVuePreview(files:any[]) {
  const vueFile = files.find(f => f.name.endsWith('.vue'))?.content || '';
  const cssFile = files.find(f => f.name.endsWith('.css'))?.content || '';

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
