"use client";

import { saveAs } from "file-saver";
import { Download } from "lucide-react";

interface DownloadButtonProps {
    code: string;
    disabled?: boolean;
}

export function DownloadButton({ code, disabled }: DownloadButtonProps) {
    const handleDownload = () => {
        const blob = new Blob([code], { type: "text/typescript;charset=utf-8" });
        saveAs(blob, "types.ts");
    };

    return (
        <button
            onClick={handleDownload}
            disabled={disabled || !code}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
        bg-white/5 border border-white/10 hover:bg-white/10
        disabled:opacity-40 disabled:cursor-not-allowed"
        >
            <Download size={14} />
            <span>Download .ts</span>
        </button>
    );
}
