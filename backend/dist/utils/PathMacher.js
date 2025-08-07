"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchPathFromCodeOrFallback = matchPathFromCodeOrFallback;
function matchPathFromCodeOrFallback(code, lang, index) {
    if (lang === "html" && code.includes("<html"))
        return "public/index.html";
    if (lang === "jsx" && code.includes("function App"))
        return "src/App.jsx";
    if (lang === "javascript" && code.includes("tailwind"))
        return "tailwind.config.js";
    return `file${index + 1}.${lang}`;
}
