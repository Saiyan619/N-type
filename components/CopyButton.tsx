"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
    code: string;
    disabled?: boolean;
}

export function CopyButton({ code, disabled }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard API unavailable — silently fail
        }
    };

    return (
        <button
            onClick={handleCopy}
            disabled={disabled || !code}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
        bg-white/5 border border-white/10 hover:bg-white/10
        disabled:opacity-40 disabled:cursor-not-allowed"
        >
            {copied ? (
                <>
                    <Check size={14} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                </>
            ) : (
                <>
                    <Copy size={14} />
                    <span>Copy</span>
                </>
            )}
        </button>
    );
}
