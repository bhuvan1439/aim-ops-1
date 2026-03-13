"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function ProductionOptimization() {
    const productionData = [
        { line: "Line 1", actual: 85, target: 90 },
        { line: "Line 2", actual: 80, target: 90 },
        { line: "Line 3", actual: 75, target: 90 }, // Below target
        { line: "Line 4", actual: 95, target: 90 },
        { line: "Line 5", actual: 88, target: 90 },
        { line: "Line 6", actual: 83, target: 90 },
        { line: "Line 7", actual: 78, target: 90 }, // Below target
        { line: "Line 8", actual: 98, target: 90 },
        { line: "Line 9", actual: 85, target: 90 },
        { line: "Line 10", actual: 89, target: 90 },
        { line: "Line 11", actual: 72, target: 90 }, // Below target
        { line: "Line 12", actual: 96, target: 90 },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface border border-slate-200 p-4 rounded-xl shadow-lg min-w-[140px]">
                    <p className="text-xs font-bold text-slate-500 mb-3">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex justify-between items-center gap-4 py-0.5">
                            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: entry.color }}>
                                {entry.name === "actual" ? "Efficiency" : "Target"}
                            </span>
                            <span className="text-sm font-bold text-slate-700">{entry.value}%</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Production Optimization</h2>
                <p className="text-sm text-slate-500 mt-1">AI-driven production efficiency analysis</p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-8">Production Line Efficiency</h3>
                <div className="flex-1 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productionData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barGap={0}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="line" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }} axisLine={false} tickLine={false} tickMargin={12} />
                            <YAxis tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }} axisLine={false} tickLine={false} tickMargin={12} domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                            
                            {/* Blue bars for Actual */}
                            <Bar dataKey="actual" name="actual" fill="var(--color-accent-blue)" radius={[2, 2, 0, 0]} barSize={24} isAnimationActive={false} />
                            
                            {/* Grey bars for Target */}
                            <Bar dataKey="target" name="target" fill="#CBD5E1" radius={[2, 2, 0, 0]} barSize={24} isAnimationActive={false} />
                            
                            <ReferenceLine y={90} stroke="#94A3B8" strokeDasharray="3 3" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Insight Box */}
            <div className="bg-surface p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <h3 className="text-xs font-bold text-accent-blue uppercase tracking-wider mb-4">AI Insight</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    Lines 3, 7, and 11 are below target efficiency. Recommended actions: recalibrate tooling on Line 3, adjust feed rate on Line 7.
                </p>
            </div>
        </div>
    );
}
