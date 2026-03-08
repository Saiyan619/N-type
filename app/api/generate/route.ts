import { NextRequest, NextResponse } from "next/server";
import { validateJson } from "@/lib/validateJson";
import { generateTypes } from "@/lib/generateTypes";
import type { GenerateRequest, GenerateResponse } from "@/types";

const MAX_INPUT_BYTES = 500_000; // 500 KB cap

export async function POST(req: NextRequest) {
    let body: GenerateRequest;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json<GenerateResponse>(
            { error: "Request body must be valid JSON." },
            { status: 400 }
        );
    }

    const { json, rootName } = body;

    if (!json || typeof json !== "string") {
        return NextResponse.json<GenerateResponse>(
            { error: "Missing or invalid `json` field in request body." },
            { status: 400 }
        );
    }

    if (Buffer.byteLength(json, "utf8") > MAX_INPUT_BYTES) {
        return NextResponse.json<GenerateResponse>(
            { error: "Input exceeds maximum allowed size (500 KB)." },
            { status: 413 }
        );
    }

    const validation = validateJson(json);

    if (!validation.valid) {
        return NextResponse.json<GenerateResponse>(
            { error: validation.error },
            { status: 400 }
        );
    }

    const safeName =
        typeof rootName === "string" && rootName.trim()
            ? rootName.trim()
            : "RootObject";

    try {
        const result = await generateTypes(json, safeName);
        return NextResponse.json<GenerateResponse>({ result }, { status: 200 });
    } catch (err) {
        const message =
            err instanceof Error ? err.message : "Failed to generate types.";
        return NextResponse.json<GenerateResponse>({ error: message }, { status: 500 });
    }
}
