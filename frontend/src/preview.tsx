// HTML Preview
export function generateHtmlPreview(files) {
  const htmlFile = files.find(f => f.name.endsWith('.html'))?.code || '';
  const cssFile = files.find(f => f.name.endsWith('.css'))?.code || '';
  const jsFile = files.find(f => f.name.endsWith('.js'))?.code || '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${cssFile}</style>
</head>
<body>
  ${htmlFile}
  <script>
    try {
      (function() {
        ${jsFile}
      })();
    } catch (error) {
      console.error('JavaScript Error:', error);
    }
  </script>
</body>
</html>`;
}



// CSS Preview
export function generateCSSPreview(files) {
  const cssFile = files.find(f => f.name.endsWith(".css"));
  const cssCode = cssFile?.code || "body { font-family: sans-serif; }";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${cssCode}
    .demo-container { margin: 20px; }
    .demo-box { width: 200px; height: 100px; background: #f0f0f0; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="demo-container">
    <h1>CSS Preview</h1>
    <p>This is a sample preview with your CSS styles applied.</p>
    <div class="demo-box">Sample Box</div>
    <button>Sample Button</button>
    <ul>
      <li>List item 1</li>
      <li>List item 2</li>
    </ul>
  </div>
</body>
</html>`;
}

// Java Preview
export function generateJavaPreview(files) {
  const javaFile = files.find(f => f.name.endsWith(".java"));
  const javaCode = javaFile?.code || "// No Java code found";
  const escapedCode = javaCode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Java Code Preview</title>
  <style>
    body { font-family: 'Courier New', monospace; background: #f5f5f5; padding: 20px; }
    .code-container { background: #1e1e1e; color: #dcdcdc; padding: 20px; border-radius: 8px; overflow-x: auto; }
  </style>
</head>
<body>
  <h2>Java Code Preview</h2>
  <p><em>Note: Java code cannot be executed in the browser</em></p>
  <div class="code-container">
    <pre>${escapedCode}</pre>
  </div>
</body>
</html>`;
}

// JavaScript Preview
export function generateJavaScriptPreview(files) {
  const jsFile = files.find(f => f.name.endsWith(".js"));
  const jsCode = jsFile?.code || 'console.log("No JavaScript code found");';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>JavaScript Preview</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    #output { background: #f9f9f9; border: 1px solid #ddd; padding: 15px; margin-top: 10px; border-radius: 4px; }
    .error { color: red; }
  </style>
</head>
<body>
  <h1>JavaScript Preview</h1>
  <div id="output"></div>
  <script>
    const output = document.getElementById('output');
    const originalLog = console.log;
    console.log = function(...args) {
      originalLog.apply(console, args);
      output.innerHTML += '<div>' + args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ') + '</div>';
    };
    try {
      (function() {
        ${jsCode}
      })();
    } catch (error) {
      console.error('Error:', error.message);
      output.innerHTML += '<div class="error">Error: ' + error.message + '</div>';
    }
  </script>
</body>
</html>`;
}

// React Preview
export function generateReactPreview(files) {
  const jsxFile = files.find(f => f.name.endsWith(".jsx") || f.name.endsWith(".tsx"));
  let cssFile = files.find(f => f.name.endsWith(".css"))?.code || "";
  let jsxCode = jsxFile?.code || "const App = () => <h3>No React component found</h3>";

  jsxCode = jsxCode
    .replace(/import[^;]+;/g, '') // remove import lines
    .replace(/export\s+default\s+([a-zA-Z0-9_$]+)/, 'const App = $1')
    .replace(/export\s+default\s+/, 'const App = ')
    .replace(/export\s+/g, '')
    .replace(/module\.exports\s*=\s*/g, '')
    .replace(/exports\.[\w$]+\s*=\s*/g, '');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>React Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; }
    #root { min-height: 100vh; }
    ${cssFile}
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
    const { useState, useEffect, useRef, useCallback, useMemo } = React;
    try {
      ${jsxCode}
      const root = ReactDOM.createRoot(document.getElementById("root"));
      if (typeof App !== 'undefined') {
        root.render(React.createElement(App));
      } else {
        document.getElementById("root").innerHTML = "<h3>No valid component found</h3>";
      }
    } catch (err) {
      console.error('React Preview Error:', err);
      document.getElementById("root").innerHTML = "<h3 style='color: red;'>Error: " + err.message + "</h3>";
    }
  </script>
</body>
</html>`;
}


// Vue Preview
export function generateVuePreview(files) {
  const vueFile = files.find(f => f.name.endsWith('.vue'));
  let cssFile = files.find(f => f.name.endsWith('.css'))?.code || '';
  let vueCode = '';

  if (vueFile?.code) {
    const code = vueFile.code;
    const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/);
    const scriptMatch = code.match(/<script>([\s\S]*?)<\/script>/);
    const styleMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/);

    const template = templateMatch ? templateMatch[1].trim() : '<div>No template</div>';
    const script = scriptMatch ? scriptMatch[1].trim() : '';
    const style = styleMatch ? styleMatch[1].trim() : '';

    // Extract export default content
    const exportObjectMatch = script.match(/export\s+default\s+{([\s\S]*?)}\s*;?\s*$/);
    const componentOptions = exportObjectMatch ? exportObjectMatch[1].trim() : '';

    vueCode = `
      const { createApp, ref, reactive, computed, onMounted, watch, defineComponent } = Vue;

      const App = {
        template: \`${template}\`,
        ${componentOptions}
      };

      createApp(App).mount('#app');
    `;
    cssFile += `\n${style}`;
  } else {
    vueCode = `
      const { createApp } = Vue;
      const App = { template: '<h3>No Vue component found</h3>' };
      createApp(App).mount('#app');
    `;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Vue Preview</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; }
    ${cssFile}
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    try {
      ${vueCode}
    } catch (error) {
      console.error('Vue Error:', error);
      document.getElementById('app').innerHTML = '<h3 style="color: red;">Error: ' + error.message + '</h3>';
    }
  </script>
</body>
</html>`;
}
