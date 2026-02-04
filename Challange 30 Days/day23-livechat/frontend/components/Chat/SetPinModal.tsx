'use client';

import { useState } from 'react';
import { X, Lock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface SetPinModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function SetPinModal({ isOpen, onClose, onSuccess }: SetPinModalProps) {
    const [pin, setPin] = useState(['', '', '', '']);
    const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
    const [step, setStep] = useState<'create' | 'confirm'>('create');
    const [loading, setLoading] = useState(false);

    const handlePinChange = (index: number, value: string, isConfirm: boolean = false) => {
        if (!/^\d*$/.test(value)) return;

        const newPin = isConfirm ? [...confirmPin] : [...pin];
        newPin[index] = value.slice(-1);

        if (isConfirm) {
            setConfirmPin(newPin);
        } else {
            setPin(newPin);
        }

        // Auto-focus next input
        if (value && index < 3) {
            const nextInput = document.getElementById(`${isConfirm ? 'confirm-' : ''}pin-${index + 1}`);
            nextInput?.focus();
        }

        // Auto-submit on last digit
        if (index === 3 && value) {
            setTimeout(() => {
                if (isConfirm) {
                    handleSubmit(newPin);
                } else {
                    setStep('confirm');
                    setTimeout(() => document.getElementById('confirm-pin-0')?.focus(), 100);
                }
            }, 100);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number, isConfirm: boolean = false) => {
        if (e.key === 'Backspace' && index > 0) {
            const currentPin = isConfirm ? confirmPin : pin;
            if (!currentPin[index]) {
                const prevInput = document.getElementById(`${isConfirm ? 'confirm-' : ''}pin-${index - 1}`);
                prevInput?.focus();
            }
        }
    };

    const handleSubmit = async (confirmedPin: string[]) => {
        const pinString = pin.join('');
        const confirmString = confirmedPin.join('');

        if (pinString !== confirmString) {
            toast.error('الرمز غير متطابق، حاول مرة ثانية');
            setConfirmPin(['', '', '', '']);
            setStep('create');
            setPin(['', '', '', '']);
            setTimeout(() => document.getElementById('pin-0')?.focus(), 100);
            return;
        }

        setLoading(true);
        try {
            await axios.post('/profile/pin', { pin: pinString });
            toast.success('تم تعيين رمز الحماية بنجاح');
            onSuccess();
            handleClose();
        } catch (error) {
            toast.error('حدث خطأ، جرب مرة ثانية');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setPin(['', '', '', '']);
        setConfirmPin(['', '', '', '']);
        setStep('create');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
                        dir="rtl"
                    >
                        {/* Header */}
                        <div className="p-6 text-center border-b border-slate-100">
                            <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {step === 'create' ? 'أنشئ رمز الحماية' : 'تأكيد الرمز'}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {step === 'create' ? 'أدخل رمز من 4 أرقام' : 'أعد إدخال الرمز للتأكيد'}
                            </p>
                            <button onClick={handleClose} className="absolute top-4 left-4 p-2 hover:bg-slate-100 rounded-xl">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* PIN Input */}
                        <div className="p-8">
                            <div className="flex justify-center gap-3 mb-6" dir="ltr">
                                {(step === 'create' ? pin : confirmPin).map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`${step === 'confirm' ? 'confirm-' : ''}pin-${index}`}
                                        type="password"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handlePinChange(index, e.target.value, step === 'confirm')}
                                        onKeyDown={(e) => handleKeyDown(e, index, step === 'confirm')}
                                        className="w-14 h-14 text-center text-2xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            {loading && (
                                <div className="flex justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
