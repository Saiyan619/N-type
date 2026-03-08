"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { JsonEditor } from "@/components/JsonEditor";
import { OutputEditor } from "@/components/OutputEditor";
import { CopyButton } from "@/components/CopyButton";
import { DownloadButton } from "@/components/DownloadButton";
import type { GenerateRequest, GenerateResponse } from "@/types";

async function generateTypes(json: string, rootName: string): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ json, rootName } satisfies GenerateRequest),
  });

  const data: GenerateResponse = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error ?? "Failed to generate types.");
  }

  return data.result!;
}

export default function Home() {
  const [jsonInput, setJsonInput] = useState("");
  const [rootName, setRootName] = useState("");

  const {
    mutate,
    data: output,
    isPending,
    isError,
    error,
    reset,
  } = useMutation({ mutationFn: ({ json, name }: { json: string; name: string }) => generateTypes(json, name) });

  const handleGenerate = () => {
    if (!jsonInput.trim()) return;
    mutate({ json: jsonInput, name: rootName.trim() || "RootObject" });
  };

  const handleInputChange = (val: string) => {
    setJsonInput(val);
    if (isError) reset(); // clear error on new input
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-tight text-white/90">N-type</span>
          <span className="text-white/30 text-sm">JSON → TypeScript</span>
        </div>

        {/* Output actions */}
        <div className="flex items-center gap-2">
          <CopyButton code={output ?? ""} disabled={!output} />
          <DownloadButton code={output ?? ""} disabled={!output} />
        </div>
      </header>

      {/* Main split layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left — JSON Input */}
        <section className="flex-1 flex flex-col border-r border-white/[0.06] min-w-0">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] gap-3">
            <span className="text-xs font-medium text-white/40 uppercase tracking-widest shrink-0">
              JSON Input
            </span>
            <input
              type="text"
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              placeholder="RootObject"
              spellCheck={false}
              className="w-36 bg-transparent border border-white/10 rounded-md px-2.5 py-1 text-xs text-white/70
                placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors font-mono"
            />
            <button
              onClick={handleGenerate}
              disabled={isPending || !jsonInput.trim()}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold
                bg-white text-black hover:bg-white/90 active:bg-white/80
                transition-colors
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating…
                </>
              ) : (
                "Generate →"
              )}
            </button>
          </div>
          <div className="flex-1 p-4">
            <JsonEditor
              value={jsonInput}
              onChange={handleInputChange}
              error={isError ? (error as Error).message : undefined}
            />
          </div>
        </section>

        {/* Right — TypeScript Output */}
        <section className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center px-5 py-3 border-b border-white/[0.06]">
            <span className="text-xs font-medium text-white/40 uppercase tracking-widest">
              TypeScript Output
            </span>
          </div>
          <div className="flex-1 p-4">
            {output ? (
              <OutputEditor value={output} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-4xl opacity-20">∿</div>
                  <p className="text-white/25 text-sm">
                    Paste JSON on the left, then click{" "}
                    <span className="text-white/40 font-medium">Generate →</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-2.5 flex items-center justify-between text-xs text-white/20">
        <span>Supports nested objects, arrays, and complex structures</span>
        <span>Powered by quicktype</span>
      </footer>
    </div>
  );
}
