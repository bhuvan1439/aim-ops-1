"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AlertTriangle } from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";

export default function AIRootCauseFinder() {
    const [causeData, setCauseData] = useState<any[]>([]);
    const [shapData, setShapData] = useState<any[]>([]);
    const [explanation, setExplanation] = useState({
        primary: "Loading...",
        secondary: "Gathering AI insights...",
        recommendation: "Analyzing historical patterns..."
    });

    useEffect(() => {
        const fetchRootCause = async () => {
            try {
                const q = query(collection(db, "process_data"), where("Batch_ID", "==", "T001"));
                const snapshot = await getDocs(q);
                const rows = snapshot.docs
                    .map(doc => doc.data())
                    .sort((a: any, b: any) => b.Time_Minutes - a.Time_Minutes);
                
                const latest = rows[0] || { Temperature_C: 185, Vibration_mm_s: 1.2, Machine_Speed: 200 };

                // Dynamically simulate causes based on real data deviations
                const tempDev = Math.abs(latest.Temperature_C - 185) * 5;
                const vibDev = latest.Vibration_mm_s * 20;
                const speedDev = Math.abs(latest.Machine_Speed - 200) * 0.5;

                const total = Math.max(0.1, tempDev + vibDev + speedDev);
                setCauseData([
                    { cause: "Vibration Spike", value: Math.round((vibDev/total)*100), fill: "var(--color-status-success)" },
                    { cause: "Speed Inconsistency", value: Math.round((speedDev/total)*100), fill: "var(--color-accent-blue)" },
                    { cause: "Thermal Drift", value: Math.round((tempDev/total)*100), fill: "var(--color-status-warning)" },
                ]);

                setShapData([
                    { feature: "Operator Shift", impact: 0.03, fill: "var(--color-status-warning)" },
                    { feature: "Pressure", impact: 0.15, fill: "var(--color-status-warning)" },
                    { feature: "Vibration", impact: (vibDev/100).toFixed(2), fill: "var(--color-status-warning)" },
                    { feature: "Temperature", impact: (tempDev/100).toFixed(2), fill: "var(--color-status-warning)" },
                ]);

                setExplanation({
                    primary: `The primary root cause is a ${latest.Temperature_C > 185 ? 'thermal increase' : 'thermal drop'} of ${Math.abs(latest.Temperature_C - 185).toFixed(1)}°C, contributing strongly to the detected anomaly.`,
                    secondary: `This correlates with a vibration level of ${latest.Vibration_mm_s.toFixed(2)} mm/s which is ${latest.Vibration_mm_s > 2.5 ? 'above' : 'within'} safety thresholds.`,
                    recommendation: `Recommendation: Recalibrate Zone 3 heating elements and check motor alignment to reduce vibration below 2.0 mm/s.`
                });

            } catch (err) {
                console.error("Root Cause Firestore Error:", err);
            }
        };
        fetchRootCause();
    }, []);

    const CustomTooltipCause = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface border border-slate-200 p-2 rounded shadow-lg">
                    <p className="text-sm font-bold text-slate-700">{payload[0].payload.cause}: {payload[0].value}%</p>
                </div>
            );
        }
        return null;
    };

    const CustomTooltipShap = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface border border-slate-200 p-2 rounded shadow-lg">
                    <p className="text-sm font-bold text-slate-700">{payload[0].payload.feature}: {payload[0].value > 0 ? '+' : ''}{payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">AI Root Cause Finder</h2>
                <p className="text-sm text-slate-500 mt-1">Explainable AI analysis of production anomalies</p>
            </div>

            {/* Top Alert Box */}
            <div className="bg-surface p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-status-warning uppercase tracking-wider">Quality Alert</span>
                    <span className="text-xs font-medium text-slate-400">Detected 2h ago</span>
                </div>
                <p className="text-base font-medium text-slate-800">
                    Quality dropped from <span className="font-bold text-status-success">98%</span> to <span className="font-bold text-status-critical">92%</span> on Production Line 2.
                </p>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[320px]">
                {/* Cause Contribution */}
                <div className="bg-surface p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Cause Contribution</h3>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={causeData} layout="vertical" margin={{ top: 0, right: 20, left: 30, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#E2E8F0" />
                                <XAxis type="number" domain={[0, 60]} tickFormatter={(val) => `${val}%`} tick={{ fontSize: 10, fill: '#94a3b8' }} tickMargin={8} axisLine={true} tickLine={true} />
                                <YAxis dataKey="cause" type="category" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }} axisLine={true} tickLine={true} />
                                <Tooltip content={<CustomTooltipCause />} cursor={{fill: '#f8fafc'}} />
                                <Bar dataKey="value" barSize={32} isAnimationActive={false}>
                                    {causeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Feature Impact SHAP */}
                <div className="bg-surface p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full justify-between">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Feature Impact (SHAP)</h3>
                    </div>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={shapData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} stroke="#E2E8F0" />
                                <XAxis type="number" hide domain={[-0.1, 0.5]} />
                                <YAxis dataKey="feature" type="category" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltipShap />} cursor={{fill: '#f8fafc'}} />
                                <Bar dataKey="impact" barSize={16} isAnimationActive={false} radius={[0, 4, 4, 0]}>
                                    {shapData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} opacity={0.7} />
                                    ))}
                                </Bar>
                                {/* Custom Labels for values at end of bars */}
                                {shapData.map((entry, index) => (
                                    <g key={`label-${index}`}>
                                        <text x={entry.impact > 0 ? "90%" : "30%"} y={`${index * 16.6 + 10}%`} dy={4} className="text-xs font-bold" fill={entry.impact > 0 ? 'var(--color-status-warning)' : 'var(--color-accent-blue)'}>
                                            {entry.impact > 0 ? '+' : ''}{entry.impact}
                                        </text>
                                    </g>
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* AI Explanation Box */}
            <div className="bg-surface p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">AI Explanation</h3>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {explanation.primary}
                </p>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {explanation.secondary}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                    {explanation.recommendation}
                </p>
            </div>
        </div>
    );
}
