"use client";
import { useState, useEffect } from "react";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Zap } from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

export default function EnergyAnalytics() {
    const [batches, setBatches] = useState<string[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<string>("T001");

    const [energyData, setEnergyData] = useState<any[]>([]);
    const [nextBatchData, setNextBatchData] = useState<any[]>([]);
    const [kpis, setKpis] = useState({
        currentLoad: 0,
        predictedNextHour: 0,
        dailySavings: 0,
        peakUsage: "00:00"
    });

    // Fetch available unique batches from Firestore
    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const q = collection(db, "production_data");
                const snapshot = await getDocs(q);
                const uniqueBatches = Array.from(new Set(snapshot.docs.map(doc => doc.data().Batch_ID))).sort();
                setBatches(uniqueBatches as string[]);
                if (uniqueBatches.length > 0 && !uniqueBatches.includes(selectedBatch)) {
                    setSelectedBatch(uniqueBatches[0] as string);
                }
            } catch (err) {
                console.error("Failed to fetch batches from Firestore:", err);
            }
        };
        fetchBatches();
    }, []);

    // Fetch batch specific analytics data from Firestore
    useEffect(() => {
        if (!selectedBatch) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/energy-analytics/${selectedBatch}`);
                if (!res.ok) throw new Error("Failed to fetch analytics");
                
                const data = await res.json();
                
                setEnergyData(data.energyData);
                setNextBatchData(data.nextBatchData);
                setKpis(data.kpis);

            } catch (err) {
                console.error("Failed to fetch energy analytics:", err);
            }
        };
        fetchData();
    }, [selectedBatch]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface border border-slate-200 p-4 rounded-xl shadow-lg min-w-[140px]">
                    <p className="text-xs font-bold text-slate-500 mb-3">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex justify-between items-center gap-4 py-0.5">
                            <span className="text-xs font-semibold" style={{ color: entry.color }}>{entry.name}</span>
                            <span className="text-sm font-bold text-slate-700">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Energy Analytics</h2>
                    <p className="text-sm text-slate-500 mt-1">AI-powered energy consumption analysis</p>
                </div>
                <div>
                    <select
                        className="bg-surface border border-slate-200 text-slate-700 text-sm font-medium rounded-lg px-4 py-2 shadow-sm outline-none cursor-pointer"
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                    >
                        {batches.map(b => <option key={b} value={b}>{b}</option>)}
                        {batches.length === 0 && <option>{selectedBatch}</option>}
                    </select>
                </div>
            </div>

            {/* Top Row KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-surface p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-6">
                        <span className="text-xs font-semibold uppercase tracking-wider">Current Load</span>
                        <Zap size={16} />
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-accent-blue">{kpis.currentLoad}</span>
                        <span className="text-xs font-medium text-slate-500 uppercase">kWh</span>
                    </div>
                </div>

                <div className="bg-surface p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-6">
                        <span className="text-xs font-semibold uppercase tracking-wider">Predicted Next Hour</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-status-warning">{kpis.predictedNextHour}</span>
                        <span className="text-xs font-medium text-slate-500 uppercase">kWh</span>
                    </div>
                </div>

                <div className="bg-surface p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">Daily Savings</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-status-success">{kpis.dailySavings}</span>
                        <span className="text-xs font-medium text-slate-500 uppercase">kWh</span>
                    </div>
                    <span className="text-xs font-bold text-status-success mt-1 flex items-center gap-1">
                        ▲ 14% vs baseline
                    </span>
                </div>

                <div className="bg-surface p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-6">
                        <span className="text-xs font-semibold uppercase tracking-wider">Peak Usage</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-accent-blue">{kpis.peakUsage}</span>
                    </div>
                </div>
            </div>

            {/* Middle Huge Chart */}
            <div className="bg-surface p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[380px]">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Energy Consumption - Actual vs Predicted vs Historical</h3>
                <div className="flex-1 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={energyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-accent-blue)" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="var(--color-accent-blue)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#CBD5E1" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#CBD5E1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} tickMargin={12} />
                            <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} tickMargin={12} />
                            <Tooltip content={<CustomTooltip />} />

                            {/* Historical Shaded Area */}
                            <Area type="monotone" dataKey="historical" name="historical" stroke="none" fill="url(#colorHistorical)" isAnimationActive={false} />

                            {/* Predicted Dashed Line */}
                            <Line type="monotone" dataKey="predicted" name="predicted" stroke="var(--color-status-success)" strokeDasharray="4 4" strokeWidth={2} dot={false} isAnimationActive={false} />

                            {/* Actual Filled Line */}
                            <Area type="monotone" dataKey="actual" name="actual" stroke="var(--color-accent-blue)" strokeWidth={2} fill="url(#colorActual)" dot={false} isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Target Chart */}
            <div className="bg-surface p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[280px]">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Predicted Energy For Next Batch</h3>
                <div className="flex-1 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={nextBatchData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} tickMargin={12} />
                            <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} tickMargin={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="energy" name="energy forecast" stroke="var(--color-status-success)" strokeWidth={2} dot={false} isAnimationActive={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
