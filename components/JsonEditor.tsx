"use client";

import Editor from "@monaco-editor/react";

interface JsonEditorProps {
    value: string;
    onChange: (val: string) => void;
    error?: string;
}

export function JsonEditor({ value, onChange, error }: JsonEditorProps) {
    return (
        <div className="flex flex-col h-full gap-2">
            <div className="flex-1 rounded-xl overflow-hidden border border-white/10">
                <Editor
                    height="100%"
                    defaultLanguage="json"
                    value={value}
                    onChange={(val) => onChange(val ?? "")}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                        formatOnPaste: true,
                        automaticLayout: true,
                    }}
                />
            </div>
            {error && (
                <div className="flex items-start gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    <span className="mt-0.5">⚠</span>
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
