"use client";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";

export default function CarbonFootprint() {
    const [batches, setBatches] = useState<any[]>([]);
    const [trendData, setTrendData] = useState<any[]>([]);

    useEffect(() => {
        const fetchSustainabilityData = async () => {
            try {
                const q = query(collection(db, "production_data"), orderBy("Batch_ID", "desc"), limit(10));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => {
                    const d = doc.data();
                    const energy = d.Energy_Consumption_kWh || 3000;
                    const co2 = (energy * 0.0005).toFixed(2);
                    let score = "A";
                    let status = "success";
                    
                    if (parseFloat(co2) > 2.0) { score = "D"; status = "critical"; }
                    else if (parseFloat(co2) > 1.8) { score = "C"; status = "warning"; }
                    else if (parseFloat(co2) > 1.5) { score = "B"; status = "accent-blue"; }

                    return {
                        id: d.Batch_ID,
                        energy: energy.toLocaleString(),
                        co2: co2,
                        score: score,
                        status: status
                    };
                });
                setBatches(data);

                // Mock trend data based on historical averages
                const mockTrend = [
                    { day: "Day 1", co2: 1.2 }, { day: "Day 5", co2: 1.8 },
                    { day: "Day 10", co2: 1.5 }, { day: "Day 15", co2: 2.1 },
                    { day: "Day 20", co2: 1.9 }, { day: "Day 25", co2: 1.4 },
                    { day: "Day 30", co2: 1.6 }
                ];
                setTrendData(mockTrend);
            } catch (err) {
                console.error("Firestore fetch error:", err);
            }
        };
        fetchSustainabilityData();
    }, []);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface border border-slate-200 p-3 rounded-lg shadow-lg flex flex-col gap-1 min-w-[120px]">
                    <p className="text-xs font-semibold text-slate-500">{label}</p>
                    <p className="text-sm font-bold text-status-warning">co2 : {payload[0].value.toFixed(2)}</p>
                    <p className="text-sm font-bold text-status-success">target : 1.5</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Carbon Footprint</h2>
                <p className="text-sm text-slate-500 mt-1">Sustainability metrics and emission tracking</p>
            </div>

            {/* Table */}
            <div className="bg-surface rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Batch ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Energy (kWh)</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CO₂ (Tons)</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50">
                        {batches.map((batch, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-5 text-sm font-medium text-slate-700">{batch.id}</td>
                                <td className="px-6 py-5 text-sm font-medium text-slate-600">{batch.energy}</td>
                                <td className="px-6 py-5 text-sm font-medium text-slate-600">{batch.co2}</td>
                                <td className="px-6 py-5 text-sm font-bold">
                                    <span className={
                                        batch.status === 'success' ? 'text-status-success' :
                                        batch.status === 'accent-blue' ? 'text-accent-blue' :
                                        batch.status === 'warning' ? 'text-status-warning' :
                                        'text-status-critical'
                                    }>{batch.score}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Trend Chart */}
            <div className="bg-surface p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">CO₂ Emission Trend (30 Days)</h3>
                <div className="flex-1 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-status-warning)" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="var(--color-status-warning)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#E2E8F0" />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }} axisLine={true} tickLine={true} tickMargin={12} />
                            <YAxis tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }} axisLine={true} tickLine={true} tickMargin={12} domain={[0, 2.2]} ticks={[0, 0.55, 1.1, 1.65, 2.2]} />
                            <Tooltip content={<CustomTooltip />} />
                            
                            <Area type="monotone" dataKey="co2" name="co2" stroke="var(--color-status-warning)" strokeWidth={2} fill="url(#colorCo2)" dot={false} isAnimationActive={false} />
                            
                            {/* Target Line */}
                            <ReferenceLine y={1.5} stroke="var(--color-status-success)" strokeDasharray="4 4" strokeWidth={1.5} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
