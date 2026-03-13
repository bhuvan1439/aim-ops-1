"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Zap, Activity, Heart, Leaf, Cpu, AlertTriangle } from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";

export default function Dashboard() {
    const [energyData, setEnergyData] = useState<any[]>([]);
    const [productionData, setProductionData] = useState<any[]>([]);
    const [anomalyData, setAnomalyData] = useState<any[]>([]);
    const [kpiData, setKpiData] = useState({
        energy: "0",
        efficiency: "0",
        health: 0,
        carbon: "B+",
        active: "0/0",
        alerts: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Energy Trend from process_data
                const processQ = query(collection(db, "process_data"), orderBy("Time_Minutes", "desc"), limit(20));
                const processSnap = await getDocs(processQ);
                const processRows = processSnap.docs.map(doc => doc.data()).reverse();
                
                const mappedEnergy = processRows.map(r => ({
                    time: `${Math.floor(r.Time_Minutes / 60)}:00`,
                    actual: Math.round(r.Power_Consumption_kW * 6),
                    predicted: Math.round(r.Power_Consumption_kW * 6.2)
                }));
                setEnergyData(mappedEnergy);

                // Fetch Production from production_data
                const prodQ = query(collection(db, "production_data"), limit(12));
                const prodSnap = await getDocs(prodQ);
                const prodRows = prodSnap.docs.map(doc => doc.data());
                
                const mappedProd = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => {
                    const row = prodRows[i] || { Energy_Consumption_kWh: 1000 };
                    return {
                        month: m,
                        target: 1000,
                        actual: Math.round(row.Energy_Consumption_kWh / 2.5)
                    };
                });
                setProductionData(mappedProd);

                // Update KPIs
                const lastProd = prodRows[0] || {};
                setKpiData({
                    energy: (lastProd.Energy_Consumption_kWh || 2847).toLocaleString(),
                    efficiency: (lastProd.Yield_Percentage || 94.2).toFixed(1),
                    health: 87,
                    carbon: "B+",
                    active: "18/22",
                    alerts: 3
                });

                // Mock Anomaly Trend
                setAnomalyData([
                    { day: "Day 1", score: 98, threshold: 5 },
                    { day: "Day 6", score: 95, threshold: 5 },
                    { day: "Day 9", score: 92, threshold: 4 },
                    { day: "Day 11", score: 96, threshold: 10, anomalies: 4 },
                    { day: "Day 13", score: 90, threshold: 5 },
                    { day: "Day 17", score: 95, threshold: 5 },
                ]);

            } catch (err) {
                console.error("Dashboard Firestore Error:", err);
            }
        };
        fetchDashboardData();
    }, []);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface border border-slate-200 p-3 rounded-lg shadow-lg">
                    <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                    {payload[0].payload.anomalies && (
                        <p className="text-sm font-bold text-status-warning mt-1">
                            anomalies: {payload[0].payload.anomalies}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
                <p className="text-sm text-slate-500 mt-1">Real-time factory operations overview</p>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {/* 1 */}
                <div className="bg-surface p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">Energy Consumption</span>
                        <Zap size={16} />
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-status-success">{kpiData.energy}</span>
                        <span className="text-sm font-medium text-slate-500">kWh</span>
                    </div>
                    <span className="text-xs font-medium text-status-critical mt-1 flex items-center gap-1">
                        ▼ 12% vs last shift
                    </span>
                </div>
                {/* 2 */}
                <div className="bg-surface p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">Production Efficiency</span>
                        <Activity size={16} />
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-status-success">{kpiData.efficiency}</span>
                        <span className="text-sm font-medium text-slate-500">%</span>
                    </div>
                    <span className="text-xs font-medium text-status-success mt-1 flex items-center gap-1">
                        ▲ 3.1% vs target
                    </span>
                </div>
                {/* 3 */}
                <div className="bg-surface p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">Machine Health Index</span>
                        <Heart size={16} />
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-accent-blue">{kpiData.health}</span>
                        <span className="text-sm font-medium text-slate-500">/ 100</span>
                    </div>
                    <span className="text-xs font-medium text-status-critical mt-1 flex items-center gap-1">
                        ▼ 2% this week
                    </span>
                </div>
                {/* 4 */}
                <div className="bg-surface p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">Carbon Score</span>
                        <Leaf size={16} />
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-status-success">{kpiData.carbon}</span>
                    </div>
                    <span className="text-xs font-medium text-status-success mt-1 flex items-center gap-1">
                        ▲ 8% improvement
                    </span>
                </div>
                {/* 5 */}
                <div className="bg-surface p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">Active Machines</span>
                        <Cpu size={16} />
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-accent-indigo">{kpiData.active}</span>
                    </div>
                </div>
                {/* 6 */}
                <div className="bg-surface p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">Maintenance Alerts</span>
                        <AlertTriangle size={16} />
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-status-warning">{kpiData.alerts}</span>
                    </div>
                </div>
            </div>

            {/* Middle Row Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[300px]">
                <div className="bg-surface p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Energy Usage Trend (24H)</h3>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={energyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="actual" stroke="var(--color-accent-blue)" strokeWidth={2} dot={false} fill="url(#colorUv)" />
                                <Line type="monotone" dataKey="predicted" stroke="var(--color-status-success)" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="bg-surface p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Production Output</h3>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productionData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} barGap={2}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{fill: '#f1f5f9'}} />
                                <Bar dataKey="actual" fill="var(--color-accent-blue)" radius={[2, 2, 0, 0]} barSize={12} />
                                <Bar dataKey="target" fill="#CBD5E1" radius={[2, 2, 0, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[320px] overflow-hidden relative">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Real-Time Anomaly Sonar</h3>
                    <p className="text-[10px] font-bold text-accent-blue uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" /> Active Scanning
                    </p>
                    
                    <div className="flex-1 w-full flex items-center justify-center relative">
                        {/* Radar Circles */}
                        <div className="absolute w-64 h-64 rounded-full border border-slate-300/50" />
                        <div className="absolute w-44 h-44 rounded-full border border-slate-300/50" />
                        <div className="absolute w-24 h-24 rounded-full border border-slate-300/50" />
                        <div className="absolute w-4 h-4 rounded-full bg-accent-blue shadow-[0_0_15px_var(--color-accent-blue)] z-10" />
                        
                        {/* Crosshairs */}
                        <div className="absolute w-full h-[1px] bg-slate-300/30" />
                        <div className="absolute w-[1px] h-full bg-slate-300/30" />

                        {/* Sweeping Radar Beam */}
                        <div className="absolute w-64 h-64 rounded-full origin-center animate-[spin_4s_linear_infinite]" 
                             style={{ background: 'conic-gradient(from 0deg, transparent 70deg, rgba(59, 130, 246, 0.4) 360deg)' }}>
                            <div className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-accent-blue shadow-[0_0_8px_var(--color-accent-blue)] origin-bottom" />
                        </div>

                        {/* Blips (Anomalies) */}
                        <div className="absolute top-8 left-16 w-3 h-3 rounded-full bg-status-critical shadow-[0_0_10px_var(--color-status-critical)] animate-pulse hover:scale-150 transition-transform cursor-pointer group" style={{ animationDelay: '0.5s' }}>
                            <div className="hidden group-hover:block absolute top-4 left-4 bg-slate-800 text-white text-[10px] p-2 rounded w-32 z-20">
                                <p className="font-bold text-status-critical">T040 Resonance</p>
                                <p>Peak: 8.2 mm/s</p>
                            </div>
                        </div>
                        <div className="absolute bottom-12 right-24 w-2 h-2 rounded-full bg-status-warning shadow-[0_0_8px_var(--color-status-warning)] animate-ping" style={{ animationDelay: '2.1s' }} />
                        <div className="absolute top-20 right-14 w-2.5 h-2.5 rounded-full bg-status-warning shadow-[0_0_8px_var(--color-status-warning)] animate-pulse" style={{ animationDelay: '3.4s' }} />
                        <div className="absolute bottom-16 left-28 w-1.5 h-1.5 rounded-full bg-status-success shadow-[0_0_5px_var(--color-status-success)] opacity-50" />
                        <div className="absolute top-32 left-8 w-1.5 h-1.5 rounded-full bg-status-success shadow-[0_0_5px_var(--color-status-success)] opacity-50" />
                    </div>
                </div>

                <div className="bg-surface p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[320px]">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Explainable AI Insights</h3>
                    
                    <div className="flex-1 w-full overflow-y-auto pr-2 pb-2">
                        {/* Decision Card */}
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col gap-4 shadow-sm relative overflow-hidden">
                            {/* Decorative gradient line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-status-critical via-status-warning to-accent-blue" />
                            
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-status-critical uppercase tracking-wider">AI Decision Explanation</span>
                                <span className="text-[9px] text-slate-600 font-bold bg-white px-2 py-1 rounded shadow-sm border border-slate-200 uppercase tracking-widest">SHAP Model</span>
                            </div>
                            
                            <div>
                                <h4 className="text-base font-bold text-slate-800">Batch Energy Spike</h4>
                                <p className="text-xs font-semibold text-slate-500 mt-1">Anomaly Confidence: <span className="text-status-critical">98.4%</span></p>
                            </div>
                            
                            <div className="flex flex-col gap-2.5 mt-1 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Identified Root Causes:</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-status-critical shadow-[0_0_4px_var(--color-status-critical)]" />
                                    <span className="text-sm text-slate-700 font-semibold tracking-tight">Motor temperature increased</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-status-warning shadow-[0_0_4px_var(--color-status-warning)]" />
                                    <span className="text-sm text-slate-700 font-semibold tracking-tight">Cooling efficiency dropped</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-status-critical shadow-[0_0_4px_var(--color-status-critical)]" />
                                    <span className="text-sm text-slate-700 font-semibold tracking-tight">Machine load exceeded threshold</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
