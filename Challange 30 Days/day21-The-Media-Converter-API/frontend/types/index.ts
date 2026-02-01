export interface UuidResponse {
    uuid_1: string;
    uuid_2: string;
    uuid_3: string;
    [key: string]: any; // Allow flexibility just in case
}

export interface TimeResponse {
    future: string;
    past: string;
    today: string;
}

export interface CryptoResponse {
    [key: string]: any;
}

export interface TextResponse {
    slug: string;
    upper: string;
    trim: string;
    limit: string;
}
