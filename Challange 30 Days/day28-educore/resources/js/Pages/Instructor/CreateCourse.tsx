import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Image as ImageIcon,
    Upload,
    Type,
    FileText,
    DollarSign,
    ChevronRight,
    Save
} from 'lucide-react';

export default function CreateCourse() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        price: '',
        category: '',
        thumbnail: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/instructor/courses');
    };

    return (
        <AuthenticatedLayout>
            <Head title="إنشاء دورة جديدة" />

            <div className="max-w-4xl mx-auto font-['Cairo']" dir="rtl">
                <div className="mb-10 text-right">
                    <h1 className="text-3xl font-black mb-2 text-black">إنشاء دورة جديدة</h1>
                    <p className="text-zinc-500 font-bold">املأ التفاصيل أدناه للبدء في بناء دورتك التدريبية.</p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white p-8 rounded-[35px] border border-zinc-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2 flex-row-reverse">
                            <div className="bg-black p-2 rounded-xl">
                                <Type className="w-5 h-5 text-[#00D1FF]" />
                            </div>
                            <h2 className="font-black text-xl">المعلومات الأساسية</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="text-right">
                                <label className="block text-sm font-black mb-2 uppercase tracking-wider text-zinc-700">عنوان الدورة</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-[#00D1FF] focus:bg-white focus:border-transparent outline-none transition-all text-right font-bold"
                                    placeholder="مثال: أنماط ريأكت المتقدمة"
                                />
                                {errors.title && <p className="mt-2 text-xs text-red-500 font-bold">{errors.title}</p>}
                            </div>

                            <div className="text-right">
                                <label className="block text-sm font-black mb-2 uppercase tracking-wider text-zinc-700">وصف الدورة</label>
                                <textarea
                                    rows={5}
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-[#00D1FF] focus:bg-white focus:border-transparent outline-none transition-all resize-none text-right font-bold"
                                    placeholder="صف ما سيتعلمه الطلاب في هذه الدورة..."
                                />
                                {errors.description && <p className="mt-2 text-xs text-red-500 font-bold">{errors.description}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Category */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[35px] border border-zinc-100 shadow-sm space-y-4">
                            <div className="flex items-center gap-3 mb-2 flex-row-reverse">
                                <div className="bg-black p-2 rounded-xl">
                                    <DollarSign className="w-5 h-5 text-[#00D1FF]" />
                                </div>
                                <h2 className="font-black text-xl">التسعير (ر.س)</h2>
                            </div>
                            <input
                                type="number"
                                value={data.price}
                                onChange={e => setData('price', e.target.value)}
                                className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-[#00D1FF] focus:bg-white focus:border-transparent outline-none transition-all text-right font-bold"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="bg-white p-8 rounded-[35px] border border-zinc-100 shadow-sm space-y-4">
                            <div className="flex items-center gap-3 mb-2 flex-row-reverse">
                                <div className="bg-black p-2 rounded-xl">
                                    <FileText className="w-5 h-5 text-[#00D1FF]" />
                                </div>
                                <h2 className="font-black text-xl">التصنيف</h2>
                            </div>
                            <select
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-[#00D1FF] focus:bg-white focus:border-transparent outline-none transition-all appearance-none text-right font-bold"
                            >
                                <option value="">اختر التصنيف</option>
                                <option value="development">البرمجة والتطوير</option>
                                <option value="design">التصميم والجرافيك</option>
                                <option value="business">الأعمال والريادة</option>
                                <option value="marketing">التسويق الرقمي</option>
                            </select>
                        </div>
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="bg-white p-8 rounded-[35px] border border-zinc-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2 flex-row-reverse">
                            <div className="bg-black p-2 rounded-xl">
                                <ImageIcon className="w-5 h-5 text-[#00D1FF]" />
                            </div>
                            <h2 className="font-black text-xl">صورة غلاف الدورة</h2>
                        </div>

                        <div className="border-2 border-dashed border-zinc-200 rounded-[30px] p-12 text-center hover:border-[#00D1FF] transition-colors cursor-pointer group relative">
                            <div className="bg-zinc-50 w-20 h-20 rounded-[25px] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00D1FF]/10 transition-colors">
                                <Upload className="w-10 h-10 text-zinc-400 group-hover:text-[#00D1FF]" />
                            </div>
                            <p className="font-black text-zinc-700 text-lg">انقر للرفع أو اسحب الصورة هنا</p>
                            <p className="text-sm text-zinc-400 mt-2 font-bold">PNG, JPG أو WEBP (الحد الأقصى 2 ميجابايت)</p>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setData('thumbnail', e.target.files?.[0] || null)} />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-6 pt-4">
                        <button type="button" className="px-8 py-4 font-black text-zinc-500 hover:text-black transition-colors">
                            حفظ كمسودة
                        </button>
                        <button
                            disabled={processing}
                            className="bg-black text-white px-12 py-4 rounded-2xl font-black text-lg flex items-center gap-3 hover:shadow-[0_0_25px_rgba(0,209,255,0.4)] transition-all border border-transparent hover:border-[#00D1FF] disabled:opacity-50"
                        >
                            <Save className="w-6 h-6 text-[#00D1FF]" />
                            إنشاء الدورة
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
