"use client";
import { useState, useEffect } from "react";
import { Activity, AlertTriangle, ThermometerSun, Zap } from "lucide-react";

export default function XRayDiagnostics() {
    const [telemetry, setTelemetry] = useState<any>(null);
    const [connectionStatus, setConnectionStatus] = useState<"Connecting..." | "Live Telemetry Active" | "Disconnected">("Connecting...");

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws/telemetry");
        
        ws.onopen = () => setConnectionStatus("Live Telemetry Active");
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setTelemetry(data);
        };
        ws.onclose = () => setConnectionStatus("Disconnected");

        return () => ws.close();
    }, []);

    const temp = telemetry?.Temperature_C || 0;
    const vib = telemetry?.Vibration_mm_s || 0;
    const power = telemetry?.Power_Consumption_kW || 0;

    // Determine Thermal Color (Blue -> Orange -> Red)
    const getThermalColor = (temp: number) => {
        if (temp < 45) return "#3B82F6"; // Accent Blue (Cool)
        if (temp < 60) return "#F59E0B"; // Warning Amber (Warming up)
        return "#EF4444"; // Critical Red (Over 60C is critical for this batch)
    };

    // Determine Vibration Shake Class
    const getVibrationClass = (vib: number) => {
        if (vib > 0.15) return "animate-[shake_0.2s_infinite]"; // Critical Resonance
        if (vib > 0.08) return "animate-[shake_0.5s_infinite]"; // Warning tremor
        return "";
    };

    return (
        <div className="flex flex-col gap-6 w-full h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">X-Ray Thermal Diagnostics</h2>
                    <p className="text-sm text-slate-500 mt-1">Live physical asset mapping & thermal tracking</p>
                </div>
                <div className="flex items-center gap-3 bg-surface px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                    <div className={`w-2 h-2 rounded-full ${connectionStatus === 'Live Telemetry Active' ? 'bg-status-success animate-pulse' : 'bg-status-critical'}`} />
                    <span className="text-xs font-bold text-slate-600 tracking-wider uppercase">{connectionStatus}</span>
                </div>
            </div>

            <div className="flex gap-6 h-full min-h-0">
                {/* Visualizer Panel */}
                <div className="flex-1 bg-surface border border-slate-200 rounded-xl shadow-lg p-6 flex flex-col relative overflow-hidden">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Live Asset Skeleton — Unit 04</h3>
                    
                    {/* The Interactive SVG */}
                    <div className="flex-1 flex items-center justify-center relative w-full">
                        <svg viewBox="0 0 800 500" className="w-full h-full drop-shadow-2xl">
                            <defs>
                                <radialGradient id="thermalGlow" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor={getThermalColor(temp)} stopOpacity={0.8} />
                                    <stop offset="100%" stopColor={getThermalColor(temp)} stopOpacity={0} />
                                </radialGradient>
                                <linearGradient id="metalGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#CBD5E1" />
                                    <stop offset="100%" stopColor="#94A3B8" />
                                </linearGradient>
                            </defs>

                            {/* Base Platform */}
                            <rect x="100" y="400" width="600" height="40" rx="4" fill="url(#metalGrad)" stroke="#64748B" strokeWidth="2" />
                            
                            {/* Main Housing */}
                            <path d="M 200 150 L 600 150 L 650 400 L 150 400 Z" fill="rgba(255,255,255,0.1)" stroke="#94A3B8" strokeWidth="3" strokeDasharray="5 5" />
                            
                            {/* Active Motor Core (Reacts to Temperature) */}
                            <g className="transition-all duration-500">
                                <circle cx="400" cy="280" r="140" fill="url(#thermalGlow)" className="animate-pulse" />
                                <circle cx="400" cy="280" r="70" fill="none" stroke={getThermalColor(temp)} strokeWidth="8" />
                                <circle cx="400" cy="280" r="50" fill={getThermalColor(temp)} opacity={0.4} />
                                {/* Spindle Axis */}
                                <line x1="200" y1="280" x2="600" y2="280" stroke={getThermalColor(temp)} strokeWidth="4" />
                            </g>

                            {/* Vibrating Chassis (Reacts to Vibration) */}
                            <g className={getVibrationClass(vib)}>
                                <rect x="350" y="80" width="100" height="70" rx="8" fill="#475569" />
                                <rect x="375" y="40" width="50" height="40" fill="#334155" />
                                {/* Fake vents */}
                                <line x1="360" y1="100" x2="440" y2="100" stroke="#1E293B" strokeWidth="4" />
                                <line x1="360" y1="115" x2="440" y2="115" stroke="#1E293B" strokeWidth="4" />
                                <line x1="360" y1="130" x2="440" y2="130" stroke="#1E293B" strokeWidth="4" />
                            </g>
                            
                            {/* Animated Power Lines */}
                            <path d="M 100 420 L 50 420 L 50 115 L 350 115" fill="none" stroke="var(--color-accent-blue)" strokeWidth="4" strokeDasharray="10 10" className="animate-[dash_1s_linear_infinite]" />

                            {/* Tooltip Overlay lines */}
                            <line x1="470" y1="280" x2="650" y2="180" stroke="#CBD5E1" strokeWidth="1" />
                            <circle cx="470" cy="280" r="4" fill="#CBD5E1" />
                        </svg>

                        {/* Floating Labels over SVG */}
                        <div className="absolute top-[28%] right-[15%] bg-surface border border-slate-200 p-3 rounded-lg shadow-xl backdrop-blur-md">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Core Temp</p>
                            <p className="text-xl font-bold" style={{ color: getThermalColor(temp) }}>{temp.toFixed(1)}°C</p>
                        </div>
                        <div className="absolute top-[10%] left-[30%] bg-surface border border-slate-200 p-3 rounded-lg shadow-xl backdrop-blur-md">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Chassis Vib</p>
                            <p className="text-xl font-bold text-slate-700">{vib.toFixed(3)} <span className="text-xs">mm/s</span></p>
                            {vib > 0.08 && <p className="text-[10px] font-bold text-status-critical mt-1 flex items-center gap-1"><AlertTriangle size={10} /> Resonance Warning</p>}
                        </div>
                    </div>
                </div>

                {/* Data Panel */}
                <div className="w-80 flex flex-col gap-4">
                    <div className="bg-surface border border-slate-200 rounded-xl shadow-lg p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-accent-blue/10 rounded-lg text-accent-blue"><ThermometerSun size={20} /></div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Thermal Engine</h4>
                                <p className="text-xs text-slate-500 font-medium">Core motor temp status</p>
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                            <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${Math.min((temp / 70) * 100, 100)}%`, backgroundColor: getThermalColor(temp) }} />
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-500">
                            <span>0°C</span>
                            <span>Limit: 65°C</span>
                        </div>
                    </div>

                    <div className="bg-surface border border-slate-200 rounded-xl shadow-lg p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-slate-800/10 rounded-lg text-slate-700"><Activity size={20} /></div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Structural Resonance</h4>
                                <p className="text-xs text-slate-500 font-medium">Chassis vibration load</p>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 mb-1">{vib.toFixed(2)}</div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">mm/s Peak Velocity</p>
                    </div>

                    <div className="bg-surface border border-slate-200 rounded-xl shadow-lg p-5 flex-1 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-indigo/5 rounded-full blur-2xl -mr-10 -mt-10" />
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-accent-indigo/10 rounded-lg text-accent-indigo"><Zap size={20} /></div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Power Input</h4>
                                <p className="text-xs text-slate-500 font-medium">Live kW draw</p>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1 mt-6">
                            <span className="text-4xl font-bold text-accent-indigo">{power.toFixed(1)}</span>
                            <span className="text-sm font-bold text-slate-500">kW</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Inject custom CSS keyframes for this page dynamically */}
            <style jsx global>{`
                @keyframes shake {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(3px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(3px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(1px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                @keyframes dash {
                    to {
                        stroke-dashoffset: -20;
                    }
                }
            `}</style>
        </div>
    );
}
