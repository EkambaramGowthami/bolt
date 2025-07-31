type File = { name: string; code: string };

export function generateHtmlPreview(files: File[]): string {
  const html = files.find(f => f.name.endsWith(".html"))?.code || "";
  const css = files.find(f => f.name.endsWith(".css"))?.code || "";
  const js = files.find(f => f.name.endsWith(".js"))?.code || "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${css}</style>
    </head>
    <body>
      ${html}
      <script>${js}</script>
    </body>
    </html>
  `;
}

export function generateCSSPreview(files: File[]): string {
  const css = files.find(f => f.name.endsWith(".css"))?.code || "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${css}</style>
    </head>
    <body>
      <p style="padding: 1rem;">Styled by CSS file</p>
    </body>
    </html>
  `;
}

export function generateJavaScriptPreview(files: File[]): string {
  const js = files.find(f => f.name.endsWith(".js"))?.code || "";

  return `
    <!DOCTYPE html>
    <html>
    <body>
      <script>${js}</script>
    </body>
    </html>
  `;
}

export function generateReactPreview(files: { name: string; code: string }[]): string {
  const indexFile = files.find((file) => file.name.includes("index") || file.name.includes("App"));
  const code = indexFile?.code || "// no code";

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>React Preview</title>
    <style>body { margin: 0; font-family: sans-serif; }</style>
  </head>
  <body>
    <div id="root"></div>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script type="text/babel" data-type="module">
      const { useState, useEffect } = React;
      ${code}

      const rootElement = document.getElementById("root");
      const root = ReactDOM.createRoot(rootElement);
      root.render(<App />);
    </script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </body>
</html>`;
}


export function generateVuePreview(files: File[]): string {
  const vueFile = files.find(f => f.name.endsWith(".vue"))?.code || "";

  const template = vueFile.match(/<template>([\s\S]*?)<\/template>/)?.[1]?.trim() || `<p>No template found</p>`;
  const rawScript = vueFile.match(/<script>([\s\S]*?)<\/script>/)?.[1]?.trim();

  const options = rawScript
    ? rawScript.replace(/^export\s+default\s+{/, '{') // remove export default
    : '{}';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
      <style>body { font-family: sans-serif; padding: 1rem; }</style>
    </head>
    <body>
      <div id="app"></div>
      <script type="module">
        const { createApp } = Vue;
        const App = {
          template: \`${template}\`,
          ${options}
        };
        createApp(App).mount("#app");
      </script>
    </body>
    </html>
  `;
}

export function generateJavaPreview(files: File[]): string {
  const code = files.find(f => f.name.endsWith(".java"))?.code || "";

  return `
    <!DOCTYPE html>
    <html>
    <body>
      <pre style="white-space: pre-wrap; padding: 1rem; font-family: monospace;">
${code}
      </pre>
    </body>
    </html>
  `;
}
