export interface GenerateRequest {
    json: string;
    rootName?: string;
}

export interface GenerateResponse {
    result?: string;
    error?: string;
}
