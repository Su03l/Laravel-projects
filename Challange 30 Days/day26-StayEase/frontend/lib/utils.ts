import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, formatStr);
}

export function formatDateForApi(date: Date): string {
    return format(date, 'yyyy-MM-dd');
}

export function formatCurrency(amount: number, currency: string = 'SAR'): string {
    return new Intl.NumberFormat('en-SA', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(amount);
}

export function calculateNights(checkIn: string | Date, checkOut: string | Date): number {
    const start = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
    const end = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getRoomTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        standard: 'غرفة قياسية',
        double: 'غرفة مزدوجة',
        suite: 'جناح',
        royal_suite: 'جناح ملكي',
        honeymoon: 'جناح شهر العسل',
    };
    return labels[type] || type;
}

export function getRoomViewLabel(view: string): string {
    const labels: Record<string, string> = {
        city: 'إطلالة على المدينة',
        sea: 'إطلالة على البحر',
        pool: 'إطلالة على المسبح',
        garden: 'إطلالة على الحديقة',
    };
    return labels[view] || view;
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        available: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        occupied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        booked: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
        maintenance: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        disabled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getRoomStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        available: 'متاح',
        occupied: 'مشغول',
        maintenance: 'صيانة',
        disabled: 'معطل',
    };
    return labels[status] || status;
}

export function getBookingStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        pending: 'قيد الانتظار',
        confirmed: 'مؤكد',
        cancelled: 'ملغي',
        completed: 'مكتمل',
    };
    return labels[status] || status;
}

export function getLocalizedAmenity(name: string): string {
    const amenities: Record<string, string> = {
        'Free Wi-Fi': 'واي فاي مجاني',
        'Smart TV': 'تلفزيون ذكي',
        'Air Conditioning': 'تكييف هواء',
        'Coffee Maker': 'ماكينة قهوة',
        'Bathtub': 'حوض استحمام',
        'Room Service': 'خدمة الغرف',
        'Mini Bar': 'ميني بار',
        'Gym Access': 'دخول النادي الرياضي',
        'Swimming Pool': 'مسبح',
        'Parking': 'موقف سيارات',
        'Breakfast Included': 'فطور مشمول',
        'Sea View': 'إطلالة بحرية',
        'City View': 'إطلالة على المدينة',
        'King Bed': 'سرير ملكي',
        'Twin Beds': 'سريرين منفصلين',
        'Balcony': 'شرفة',
        'Safe': 'خزنة',
        'Iron': 'مكواة',
        'Hair Dryer': 'مجفف شعر',
    };
    if (amenities[name]) return amenities[name];

    const lowerName = name.toLowerCase();
    for (const key in amenities) {
        if (key.toLowerCase() === lowerName) return amenities[key];
    }

    return name;
}
