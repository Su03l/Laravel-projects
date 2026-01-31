'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface FinancialChartProps {
    income: number;
    expense: number;
}

const COLORS = ['#16a34a', '#dc2626']; // Green-600, Red-600

export default function FinancialChart({ income, expense }: FinancialChartProps) {
    const data = [
        { name: 'Income', value: Number(income) },
        { name: 'Expense', value: Number(expense) },
    ];

    // Filter out zero values to avoid empty chart weirdness if data not loaded
    const activeData = data.filter(d => d.value > 0);

    if (activeData.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-gray-100 text-gray-400">
                No financial data to display
            </div>
        );
    }

    return (
        <div className="h-80 w-full bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={activeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {activeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.name === 'Income' ? COLORS[0] : COLORS[1]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: any) => [`$${Number(value).toFixed(2)}`, '']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
