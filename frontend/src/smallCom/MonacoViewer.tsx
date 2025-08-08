
import Editor from "@monaco-editor/react";
interface typeCode {
  code:string,
  language:string
}
export const MonacoViewer = ({ code, language }:typeCode) => {
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
