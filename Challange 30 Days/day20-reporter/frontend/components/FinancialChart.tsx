'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface FinancialChartProps {
    income: number;
    expense: number;
}

const COLORS = ['#16a34a', '#dc2626']; // Green-600, Red-600

export default function FinancialChart({ income, expense }: FinancialChartProps) {
    const data = [
        { name: 'دخل', value: Number(income) },
        { name: 'صرف', value: Number(expense) },
    ];

    // Filter out zero values to avoid empty chart weirdness if data not loaded
    const activeData = data.filter(d => d.value > 0);

    if (activeData.length === 0) {
        return (
            <div className="h-80 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 text-gray-400 p-6 shadow-sm">
                <div className="mb-2 rounded-full bg-gray-50 p-4">
                    <PieChartIcon className="h-8 w-8 text-gray-300" />
                </div>
                <p>ما فيه بيانات كافية للرسم البياني</p>
            </div>
        );
    }

    return (
        <div className="h-96 w-full bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">توزيع الإيرادات والمصاريف</h3>
            <div className="h-[300px] w-full" dir="ltr"> {/* Recharts needs LTR usually for positioning, but labels can be Arabic */}
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={activeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
                        >
                            {activeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.name === 'دخل' ? COLORS[0] : COLORS[1]} />
                            ))}
                        </Pie>
                        <Tooltip
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            formatter={(value: any) => [`$${Number(value).toFixed(2)}`, '']}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'var(--font-cairo)' }}
                            itemStyle={{ fontWeight: 'bold' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontFamily: 'var(--font-cairo)' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
