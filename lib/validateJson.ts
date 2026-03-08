export type ValidationResult =
  | { valid: true; data: unknown }
  | { valid: false; error: string };

export function validateJson(input: string): ValidationResult {
  if (!input || input.trim() === "") {
    return { valid: false, error: "Input is empty." };
  }

  try {
    const data = JSON.parse(input);
    return { valid: true, data };
  } catch {
    return { valid: false, error: "Invalid JSON: unable to parse input." };
  }
}
