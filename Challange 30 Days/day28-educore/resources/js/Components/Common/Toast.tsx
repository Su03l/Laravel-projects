import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export default function Toast() {
    const { flash } = usePage().props as any;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (flash.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
        if (flash.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible) return null;

    return (
        <div className="fixed bottom-8 left-8 z-[100] animate-in slide-in-from-left-10 duration-300 font-['Cairo']" dir="rtl">
            <div className={`
                flex items-center gap-4 p-4 rounded-2xl shadow-2xl border min-w-[300px]
                ${type === 'success'
                    ? 'bg-black border-[#00D1FF] text-white'
                    : 'bg-white border-red-100 text-red-600'
                }
            `}>
                <div className={`
                    p-2 rounded-xl
                    ${type === 'success' ? 'bg-[#00D1FF]/20 text-[#00D1FF]' : 'bg-red-50 text-red-600'}
                `}>
                    {type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>

                <div className="flex-1">
                    <p className="text-sm font-black">{message}</p>
                </div>

                <button
                    onClick={() => setVisible(false)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-2xl overflow-hidden">
                <div className={`
                    h-full animate-progress
                    ${type === 'success' ? 'bg-[#00D1FF]' : 'bg-red-500'}
                `} style={{ animationDuration: '5000ms' }}></div>
            </div>
        </div>
    );
}
