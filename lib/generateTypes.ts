import {
    quicktype,
    InputData,
    jsonInputForTargetLanguage,
} from "quicktype-core";

export async function generateTypes(json: string, name = "RootObject"): Promise<string> {
    const jsonInput = jsonInputForTargetLanguage("typescript");

    await jsonInput.addSource({
        name,
        samples: [json],
    });

    const inputData = new InputData();
    inputData.addInput(jsonInput);

    const result = await quicktype({
        inputData,
        lang: "typescript",
        rendererOptions: {
            "just-types": "true",
        },
    });

    return result.lines.join("\n");
}
