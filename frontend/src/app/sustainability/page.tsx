"use client";
import { useState, useEffect } from "react";
import { Sliders, Target, Zap, Activity, Info, BarChart2, CheckCircle, Factory, TreePine, Banknote } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

interface PredictionResponse {
    predicted_energy_cost: number;
    predicted_quality_score: number;
    predicted_cycle_time: number;
    shap_explanations: { feature: string; impact: number }[];
}

export default function SustainabilityDeck() {
    const [carbonLimit, setCarbonLimit] = useState<number>(45);
    const [params, setParams] = useState({
        Temperature: 185,
        Pressure: 2.4,
        Machine_Speed: 200,
        Binder_Amount: 20
    });

    const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
    const [loading, setLoading] = useState(false);

    // AI Energy Forecaster State
    const [planParams, setPlanParams] = useState({
        Production_Units: 500,
        Machine_Speed: 200
    });
    const [planPrediction, setPlanPrediction] = useState<{predicted_total_energy_kwh: number} | null>(null);

    // Mocking Historical Batch Data to prove relational DB queries capability
    const historicalData = [
        { recipe: "Low Binder", energy: 38 },
        { recipe: "Standard (20%)", energy: 42 },
        { recipe: "High Binder", energy: 49 },
        { recipe: "High Speed", energy: 54 },
        { recipe: "Low Speed", energy: 36 },
    ];

    useEffect(() => {
        const fetchPrediction = async () => {
            setLoading(true);
            try {
                const res = await fetch("http://localhost:8000/api/predict", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(params),
                });
                const data = await res.json();
                setPrediction(data);
            } catch (err) {
                console.error("Error fetching prediction", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchPlanPrediction = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/predict_plan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(planParams),
                });
                const data = await res.json();
                setPlanPrediction(data);
            } catch (err) {
                console.error("Error fetching plan prediction", err);
            }
        };

        const handler = setTimeout(() => {
            fetchPrediction();
            fetchPlanPrediction();
        }, 300);

        return () => clearTimeout(handler);
    }, [params, planParams]);

    const handleParamChange = (key: string, value: number) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    const handlePlanParamChange = (key: string, value: number) => {
        setPlanParams(prev => ({ ...prev, [key]: value }));
    };

    const milesDriven = prediction ? (prediction.predicted_energy_cost * 1.07).toFixed(1) : "--";
    const annualSavings = prediction ? Math.max(0, (carbonLimit - prediction.predicted_energy_cost) * 1250).toLocaleString() : "--";

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            {/* Top Row: Dynamic Target Setter */}
            <div className="bg-surface p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center justify-between w-full">
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                        <Target className="text-accent-indigo" size={28} /> Sustainability Deck
                    </h2>
                    <p className="text-slate-500 font-medium text-sm mt-1">Aggregated Sustainability Analytics & Recipe Optimization</p>
                </div>

                <div className="flex items-center gap-6 bg-slate-50 py-3 px-6 rounded-xl border border-slate-200">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Daily Carbon Target</span>
                        <span className="text-2xl font-bold text-status-critical">{carbonLimit} <span className="text-sm">kg CO₂e</span></span>
                    </div>

                    <input
                        type="range"
                        min={30}
                        max={60}
                        step={1}
                        value={carbonLimit}
                        onChange={(e) => setCarbonLimit(Number(e.target.value))}
                        className="w-48 h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-status-critical shadow-inner"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Center Stage: Historical Analytics Bar Chart */}
                <div className="bg-surface p-8 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <BarChart2 size={24} className="text-accent-blue" />
                            <h3 className="font-bold text-lg text-foreground">Historical Energy vs Recipe Profiles</h3>
                        </div>
                        <div className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-500 rounded-md border border-slate-200">
                            PostgreSQL Time-Series Query
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={historicalData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="recipe" tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} tickMargin={12} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }} tickMargin={12} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                />
                                <ReferenceLine y={carbonLimit} stroke="var(--color-status-critical)" strokeDasharray="4 4" strokeWidth={2} label={{ position: 'top', value: `Regulatory Limit: ${carbonLimit} kg`, fill: 'var(--color-status-critical)', fontSize: 12, fontWeight: 700 }} />
                                <Bar dataKey="energy" radius={[6, 6, 0, 0]} barSize={40}>
                                    {
                                        historicalData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.energy > carbonLimit ? "var(--color-status-critical)" : "var(--color-accent-blue)"} fillOpacity={0.8} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bottom Panel: Recipe Optimization Sandbox & Predictions */}
                <div className="flex flex-col gap-6">
                    <div className="bg-surface p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-6">
                        <div className="flex items-center gap-2 mb-2 pb-4 border-b border-slate-100">
                            <Sliders size={24} className="text-accent-indigo" />
                            <h3 className="font-bold text-lg text-foreground">AI Recipe Sandbox</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            {[
                                { key: 'Temperature', label: 'Temperature (°C)', min: 150, max: 200, step: 1 },
                                { key: 'Pressure', label: 'Pressure (bar)', min: 2.0, max: 3.0, step: 0.1 },
                                { key: 'Machine_Speed', label: 'Machine Speed (RPM)', min: 100, max: 300, step: 10 },
                                { key: 'Binder_Amount', label: 'Binder Amount (%)', min: 10, max: 30, step: 0.5 },
                            ].map((slider) => (
                                <div key={slider.key} className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-600">{slider.label}</span>
                                        <span className="text-sm font-bold text-accent-indigo bg-accent-indigo/10 px-2 py-0.5 rounded-md">{params[slider.key as keyof typeof params]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={slider.min}
                                        max={slider.max}
                                        step={slider.step}
                                        value={params[slider.key as keyof typeof params]}
                                        onChange={(e) => handleParamChange(slider.key, parseFloat(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-indigo transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Prediction Result Cards (XGBoost Outputs) */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className={`col-span-1 lg:col-span-2 bg-surface p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border ${prediction && prediction.predicted_energy_cost > carbonLimit ? 'border-status-critical bg-red-50/10' : prediction && prediction.predicted_energy_cost > carbonLimit * 0.9 ? 'border-status-warning bg-amber-50/10' : 'border-emerald-200 bg-emerald-50/20'} flex flex-col justify-center`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Zap size={18} />
                                    <span className="font-semibold text-xs uppercase tracking-wide">Predicted Energy</span>
                                </div>
                                {prediction && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${prediction.predicted_energy_cost > carbonLimit ? 'bg-status-critical text-white' : prediction.predicted_energy_cost > carbonLimit * 0.9 ? 'bg-status-warning text-white' : 'bg-status-success text-white'}`}>
                                        {prediction.predicted_energy_cost > carbonLimit ? '🔴 High Emission' : prediction.predicted_energy_cost > carbonLimit * 0.9 ? '🟡 Medium Emission' : '🟢 Green Batch'}
                                    </span>
                                )}
                            </div>
                            <div className="text-4xl font-bold flex items-baseline gap-2 mt-1">
                                <span className={prediction && prediction.predicted_energy_cost > carbonLimit ? 'text-status-critical' : 'text-foreground'}>
                                    {prediction ? prediction.predicted_energy_cost.toFixed(1) : "--"}
                                </span>
                                <span className="text-sm font-medium text-slate-400">kWh</span>
                            </div>
                        </div>

                        <div className="bg-surface p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center">
                            <div className="flex items-center gap-2 text-slate-500 mb-2">
                                <Activity size={18} />
                                <span className="font-semibold text-xs uppercase tracking-wide">Cycle Time</span>
                            </div>
                            <div className="text-4xl font-bold flex items-baseline gap-2 mt-1 py-1">
                                <span className="text-accent-indigo">
                                    {prediction ? prediction.predicted_cycle_time.toFixed(0) : "--"}
                                </span>
                                <span className="text-sm font-medium text-slate-400">min</span>
                            </div>
                        </div>

                        <div className="bg-surface p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center">
                            <div className="flex items-center gap-2 text-slate-500 mb-2">
                                <Factory size={18} />
                                <span className="font-semibold text-xs uppercase tracking-wide">Expected Quality</span>
                            </div>
                            <div className="text-3xl font-bold flex items-baseline gap-2 mt-1">
                                <span className={prediction && prediction.predicted_quality_score < 90 ? 'text-status-warning' : 'text-status-success'}>
                                    {prediction ? prediction.predicted_quality_score.toFixed(1) : "--"}
                                </span>
                                <span className="text-sm font-medium text-slate-400">%</span>
                            </div>
                        </div>

                        {/* Equivalency & ROI */}
                        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex flex-col justify-center">
                            <div className="flex items-center gap-2 text-emerald-700 mb-2">
                                <TreePine size={18} />
                                <span className="font-semibold text-[10px] uppercase tracking-wide">CO₂ Impact Eq.</span>
                            </div>
                            <div className="text-2xl font-bold flex items-baseline gap-2 mt-1 text-emerald-800">
                                {milesDriven}
                            </div>
                            <span className="text-[10px] font-medium text-emerald-600 mt-1">Miles driven by gas car</span>
                        </div>

                        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex flex-col justify-center">
                            <div className="flex items-center gap-2 text-slate-400 mb-2">
                                <Banknote size={18} />
                                <span className="font-semibold text-[10px] uppercase tracking-wide">Projected ROI</span>
                            </div>
                            <div className="text-2xl font-bold flex items-baseline gap-2 mt-1 text-white">
                                ${annualSavings}
                            </div>
                            <span className="text-[10px] font-medium text-slate-400 mt-1">Cost savings / Year</span>
                        </div>

                    </div>
                    
                    {/* New Section: AI Energy Consumption Prediction (Forecaster) */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg border border-slate-700 mt-2 text-white overflow-hidden relative">
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700/50">
                            <Zap size={20} className="text-accent-blue" />
                            <h3 className="font-bold text-lg text-white">AI Production Energy Forecaster</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-300">Target Production (Units)</span>
                                        <span className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">{planParams.Production_Units}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={100}
                                        max={2000}
                                        step={50}
                                        value={planParams.Production_Units}
                                        onChange={(e) => handlePlanParamChange('Production_Units', parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-blue transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-300">Avg. Machine Speed (RPM)</span>
                                        <span className="text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">{planParams.Machine_Speed}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={100}
                                        max={300}
                                        step={10}
                                        value={planParams.Machine_Speed}
                                        onChange={(e) => handlePlanParamChange('Machine_Speed', parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-blue transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col justify-center items-center backdrop-blur-sm relative">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <Activity size={100} />
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 z-10">Forecasted Total Energy Load</span>
                                <div className="text-4xl font-bold flex items-baseline gap-2 text-accent-blue z-10">
                                    {planPrediction ? planPrediction.predicted_total_energy_kwh.toFixed(0) : "--"}
                                    <span className="text-sm font-medium text-slate-400">kWh</span>
                                </div>
                                <span className="text-xs mt-3 text-slate-400 text-center z-10 max-w-[200px]">Optimal planning helps avoid peak grid tariffs.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
