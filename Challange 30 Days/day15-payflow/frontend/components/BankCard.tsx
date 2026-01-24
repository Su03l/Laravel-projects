'use client';

import React, { useState } from 'react';
import { CreditCard, Eye, EyeOff, ShieldCheck, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BankCardProps {
    name: string;
    balance: string;
}

const BankCard: React.FC<BankCardProps> = ({ name, balance }) => {
    const [showBalance, setShowBalance] = useState(true);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
            className="relative w-full max-w-sm mx-auto aspect-[1.58/1] card-stealth rounded-[2rem] p-8 overflow-hidden group border border-white/10 shadow-2xl"
        >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />

            <div className="absolute -inset-full w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent -rotate-45 translate-x-[-100%] group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

            <div className="relative h-full flex flex-col justify-between text-white z-10">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.25em] font-medium text-slate-500">الرصيد المتاح</p>
                        <div className="flex items-center gap-3">
                            <AnimatePresence mode="wait">
                                <motion.h2
                                    key={showBalance ? 'visible' : 'hidden'}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-3xl font-bold tracking-tight"
                                >
                                    {showBalance ? balance : '•••••• SAR'}
                                </motion.h2>
                            </AnimatePresence>
                            <button
                                onClick={() => setShowBalance(!showBalance)}
                                className="p-1.5 hover:bg-white/5 rounded-full transition-all active:scale-90"
                            >
                                {showBalance ? <EyeOff className="w-4 h-4 opacity-30 hover:opacity-100 transition-opacity" /> : <Eye className="w-4 h-4 opacity-30 hover:opacity-100 transition-opacity" />}
                            </button>
                        </div>
                    </div>

                    <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
                        <CreditCard className="w-6 h-6 text-brand-blue" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-slate-700 to-slate-500 p-[1px] shadow-lg flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-slate-800/80 rounded-[5px] flex items-center justify-center opacity-70">
                            <Cpu className="w-5 h-5 text-slate-400" strokeWidth={1} />
                        </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-brand-blue/40 blur-[2px] animate-glow" />
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                        <p className="text-[9px] uppercase tracking-[0.3em] font-medium text-slate-500">حامل البطاقة</p>
                        <p className="text-lg font-bold tracking-wide text-white/90">{name}</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10"
                    >
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-500/80">نشط الآن</span>
                    </motion.div>
                </div>
            </div>

            {/* Border Glow on Hover */}
            <div className="absolute inset-0 rounded-[2rem] border border-brand-blue/0 group-hover:border-brand-blue/20 transition-colors duration-500 pointer-events-none" />
        </motion.div>
    );
};

export default BankCard;
