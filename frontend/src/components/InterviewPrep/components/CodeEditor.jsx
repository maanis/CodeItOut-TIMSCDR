import Editor from "@monaco-editor/react";
import { Loader2 } from "lucide-react";

export function CodeEditor({ value, onChange, language = "javascript", readOnly = false, theme = "vs-dark" }) {
    const getMonacoTheme = (themeName) => {
        switch (themeName) {
            case "Light":
                return "light";
            case "High Contrast":
                return "hc-black";
            default:
                return "vs-dark";
        }
    };
    return (
        <div className="h-full w-full">
            <Editor
                height="100%"
                defaultLanguage={language}
                language={language}
                value={value}
                onChange={onChange}
                theme={getMonacoTheme(theme)}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    readOnly,
                    wordWrap: "on",
                    wrappingStrategy: "advanced",
                    padding: { top: 16, bottom: 16 },
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    acceptSuggestionOnEnter: "on",
                    tabCompletion: "on",
                }}
                loading={
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                }
            />
        </div>
    );
}
