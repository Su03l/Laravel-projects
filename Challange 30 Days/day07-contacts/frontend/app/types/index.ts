export interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    full_phone: string;
    photo_url: string | null;
    details: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface PaginatedResponse {
    data: Contact[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface ContactFormData {
    first_name: string;
    last_name: string;
    country_code: string;
    phone: string;
    details?: string;
    photo?: File | null;
}

export const COUNTRY_CODES = [
    { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+971', name: 'UAE', flag: '🇦🇪' },
    { code: '+20', name: 'Egypt', flag: '🇪🇬' },
    { code: '+962', name: 'Jordan', flag: '🇯🇴' },
    { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
    { code: '+974', name: 'Qatar', flag: '🇶🇦' },
    { code: '+973', name: 'Bahrain', flag: '🇧🇭' },
    { code: '+968', name: 'Oman', flag: '🇴🇲' },
    { code: '+1', name: 'USA/Canada', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
];
