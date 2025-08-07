
import Editor from "@monaco-editor/react";

export const MonacoViewer = ({ code, language }) => {
  return (
    <Editor
      height="500px"
      defaultLanguage={language}
      defaultValue={code}
      theme="vs-dark"
      options={{ readOnly: true, fontSize: 14 }}
    />
  );
};
