import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Request Interceptor - Attach Bearer Token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError<any>) => {
        let message = "حدث خطأ غير متوقع";

        if (error.response) {
            switch (error.response.status) {
                case 401:
                    message = "جلسة العمل انتهت، يرجى تسجيل الدخول";
                    // Clear token on 401
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("token");
                    }
                    break;
                case 403:
                    message = error.response.data?.message || "ليس لديك صلاحية للقيام بهذا الإجراء";
                    break;
                case 422:
                    message = error.response.data?.message || "تأكد من صحة البيانات المدخلة";
                    break;
                case 429:
                    message = "تم تجاوز حد الطلبات المسموح به";
                    break;
                case 500:
                    message = "خطأ في الخادم، يرجى المحاولة لاحقاً";
                    break;
                default:
                    message = error.response.data?.message || message;
            }
        } else if (error.request) {
            message = "فشل الاتصال بالخادم، تحقق من الانترنت";
        }

        toast.error(message, {
            style: {
                background: "#ef4444",
                color: "#fff",
                border: "1px solid #7f1d1d"
            }
        });

        return Promise.reject(error);
    }
);

export default api;
