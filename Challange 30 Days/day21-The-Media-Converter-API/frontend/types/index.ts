export interface UuidResponse {
    id_1: string;
    id_2: string;
    random_string: string;
}

export interface TimeResponse {
    future: string;
    past: string;
    today: string;
}

export interface CryptoResponse {
    // Add specific Coindesk fields if known, or use any
    [key: string]: any;
}

export interface TextResponse {
    slug: string;
    upper: string;
    trim: string;
    limit: string;
}
