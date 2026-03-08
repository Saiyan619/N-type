"use client";

import Editor from "@monaco-editor/react";

interface OutputEditorProps {
    value: string;
}

export function OutputEditor({ value }: OutputEditorProps) {
    return (
        <div className="h-full rounded-xl overflow-hidden border border-white/10">
            <Editor
                height="100%"
                defaultLanguage="typescript"
                value={value}
                theme="vs-dark"
                options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    automaticLayout: true,
                }}
            />
        </div>
    );
}
