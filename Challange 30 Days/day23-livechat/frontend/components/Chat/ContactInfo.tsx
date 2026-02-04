'use client';

import { useStore } from '@/lib/store';
import { Bell, Ban, Flag, Trash2, Image as ImageIcon } from 'lucide-react';

export default function ContactInfo() {
    const { activeConversationId, conversations } = useStore();

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    if (!activeConversation) return null;

    return (
        <div className="h-full bg-white border-r border-slate-100 flex flex-col overflow-y-auto">
            <div className="p-8 flex flex-col items-center border-b border-slate-50">
                <div className="w-24 h-24 rounded-full bg-slate-200 mb-4 overflow-hidden shadow-lg border-4 border-white ring-1 ring-slate-100">
                    <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 text-2xl font-bold">
                        {activeConversation.name?.[0]}
                    </div>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{activeConversation.name}</h2>
                <p className="text-slate-500 text-sm mt-1 text-center" dir="ltr">+966 5x xxx xxxx</p>
                <p className="text-slate-400 text-xs mt-2 text-center px-4">
                    "الحياة حلوة بس نفهمها"
                </p>
            </div>

            <div className="p-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">الوسائط</h3>
                <div className="grid grid-cols-3 gap-2 mb-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="aspect-square bg-slate-100 rounded-xl overflow-hidden hover:opacity-80 transition-opacity cursor-pointer">
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <ImageIcon className="w-4 h-4" />
                            </div>
                        </div>
                    ))}
                </div>

                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">الإعدادات</h3>
                <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-sm">
                        <Bell className="w-4 h-4" /> الإشعارات
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 transition-colors text-sm">
                        <Ban className="w-4 h-4" /> حظر المستخدم
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 transition-colors text-sm">
                        <Flag className="w-4 h-4" /> إبلاغ
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 transition-colors text-sm">
                        <Trash2 className="w-4 h-4" /> حذف المحادثة
                    </button>
                </div>
            </div>
        </div>
    );
}
