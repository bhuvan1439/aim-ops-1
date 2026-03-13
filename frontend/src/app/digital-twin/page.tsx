"use client";
import { useState } from "react";

export default function DigitalTwinSimulator() {
    const [temperature, setTemperature] = useState(185);
    const [pressure, setPressure] = useState(2.4);
    const [speed, setSpeed] = useState(60);
    const [cycleTime, setCycleTime] = useState(45);
    const [isSimulating, setIsSimulating] = useState(false);
    const [results, setResults] = useState<any>(null);

    const runSimulation = () => {
        setIsSimulating(true);
        // Mocking a network request delay
        setTimeout(() => {
            setResults({
                quality: (90 + Math.random() * 8).toFixed(1),
                energy: (120 + Math.random() * 30).toFixed(0),
                wear: (2 + Math.random() * 2).toFixed(2),
                status: temperature > 205 || pressure > 3.2 ? 'warning' : 'success'
            });
            setIsSimulating(false);
        }, 1200);
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Digital Twin Simulator</h2>
                <p className="text-sm text-slate-500 mt-1">Test machine parameters before applying to the real factory</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[500px]">
                {/* Adjust Parameters Panel */}
                <div className="lg:col-span-3 bg-surface p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-8">Adjust Parameters</h3>
                    
                    <div className="flex-1 flex flex-col gap-8 justify-center px-4">
                        {/* Slider 1: Temperature */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700">Temperature</span>
                                <span className="text-sm font-bold text-accent-indigo">{temperature} °C</span>
                            </div>
                            <input 
                                type="range" 
                                min="150" max="220" 
                                value={temperature} 
                                onChange={(e) => setTemperature(parseInt(e.target.value))}
                                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-blue"
                            />
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                                <span>150°C</span>
                                <span>220°C</span>
                            </div>
                        </div>

                        {/* Slider 2: Pressure */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700">Pressure</span>
                                <span className="text-sm font-bold text-accent-indigo">{pressure.toFixed(1)} bar</span>
                            </div>
                            <input 
                                type="range" 
                                min="1" max="4" step="0.1"
                                value={pressure} 
                                onChange={(e) => setPressure(parseFloat(e.target.value))}
                                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-blue"
                            />
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                                <span>1bar</span>
                                <span>4bar</span>
                            </div>
                        </div>

                        {/* Slider 3: Speed */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700">Speed</span>
                                <span className="text-sm font-bold text-accent-indigo">{speed} RPM</span>
                            </div>
                            <input 
                                type="range" 
                                min="20" max="100" 
                                value={speed} 
                                onChange={(e) => setSpeed(parseInt(e.target.value))}
                                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-blue"
                            />
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                                <span>20RPM</span>
                                <span>100RPM</span>
                            </div>
                        </div>

                        {/* Slider 4: Cycle Time */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700">Cycle Time</span>
                                <span className="text-sm font-bold text-accent-indigo">{cycleTime} min</span>
                            </div>
                            <input 
                                type="range" 
                                min="20" max="80" 
                                value={cycleTime} 
                                onChange={(e) => setCycleTime(parseInt(e.target.value))}
                                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-blue"
                            />
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                                <span>20min</span>
                                <span>80min</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={runSimulation}
                        disabled={isSimulating}
                        className={`w-full py-3.5 rounded-lg text-white font-bold text-sm shadow-md transition-all mt-6 ${
                            isSimulating ? 'bg-accent-blue/70 cursor-wait' : 'bg-accent-blue hover:bg-blue-600 hover:shadow-lg'
                        }`}
                    >
                        {isSimulating ? 'Simulating...' : 'Run Simulation'}
                    </button>
                </div>

                {/* Predicted Results Panel */}
                <div className="lg:col-span-2 bg-surface p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-8">Predicted Results</h3>
                    
                    <div className="flex-1 flex flex-col items-center justify-center">
                        {!results && !isSimulating && (
                            <span className="text-sm font-medium text-slate-500">Adjust parameters and click Run Simulation</span>
                        )}

                        {isSimulating && (
                            <div className="flex flex-col gap-4 items-center animate-pulse">
                                <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-accent-blue animate-spin" />
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Running AI Models...</span>
                            </div>
                        )}

                        {results && !isSimulating && (
                            <div className="w-full flex w-full flex-col gap-6 animate-in fade-in duration-500">
                                <div className="flex justify-between items-center p-4 border border-slate-100 rounded-lg bg-slate-50">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Predicted Quality</span>
                                    <span className={`text-xl font-black ${results.quality > 95 ? 'text-status-success' : 'text-status-warning'}`}>{results.quality}%</span>
                                </div>
                                <div className="flex justify-between items-center p-4 border border-slate-100 rounded-lg bg-slate-50">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Predicted Energy Load</span>
                                    <span className="text-xl font-black text-slate-700">{results.energy} kWh</span>
                                </div>
                                <div className="flex justify-between items-center p-4 border border-slate-100 rounded-lg bg-slate-50">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Wear & Tear</span>
                                    <span className={`text-xl font-black ${results.status === 'warning' ? 'text-status-critical' : 'text-slate-700'}`}>{results.wear}% / hr</span>
                                </div>
                                
                                {results.status === 'warning' && (
                                    <div className="mt-2 p-3 rounded bg-status-critical/10 border-l-4 border-status-critical">
                                        <p className="text-xs font-bold text-status-critical">Warning: High heat/pressure combination may damage internal seals rapidly.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
