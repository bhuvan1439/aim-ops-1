"use client";
import { useState } from "react";

export default function EnergyWasteHeatmap() {
    const [shift, setShift] = useState("Morning (6AM-2PM)");

    const machines = [
        { id: "M1", name: "CNC Mill", status: "normal", colSpan: 1 },
        { id: "M2", name: "Injection Molder", status: "high", colSpan: 1 },
        { id: "M3", name: "Press Unit", status: "medium", colSpan: 1 },
        { id: "M4", name: "Assembly Line", status: "normal", colSpan: 2 },
        { id: "M5", name: "Welding Station", status: "high", colSpan: 1 },
        { id: "M6", name: "Packaging", status: "normal", colSpan: 1 },
        { id: "M7", name: "Quality Control", status: "medium", colSpan: 1 },
        { id: "M8", name: "Storage", status: "normal", colSpan: 1 },
    ];

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'normal': return "bg-status-success/10 border-status-success/30 text-status-success";
            case 'medium': return "bg-status-warning/10 border-status-warning/30 text-status-warning";
            case 'high': return "bg-status-critical/10 border-status-critical/30 text-status-critical";
            default: return "bg-slate-50 border-slate-200 text-slate-500";
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Energy Waste Heatmap</h2>
                    <p className="text-sm text-slate-500 mt-1">Factory floor energy visualization</p>
                </div>
                <div>
                    <select 
                        className="bg-surface border border-slate-200 text-slate-700 text-sm font-medium rounded-lg px-4 py-2 shadow-sm outline-none cursor-pointer"
                        value={shift}
                        onChange={(e) => setShift(e.target.value)}
                    >
                        <option>Morning (6AM-2PM)</option>
                        <option>Afternoon (2PM-10PM)</option>
                        <option>Night (10PM-6AM)</option>
                    </select>
                </div>
            </div>

            <div className="bg-surface p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center min-h-[500px]">
                
                {/* Factory Floor Grid */}
                <div className="w-full max-w-4xl border border-slate-100 bg-slate-50/50 p-12 rounded-2xl flex-1 flex flex-col justify-center items-center gap-12 relative">
                    
                    {/* Top Row */}
                    <div className="flex gap-6 w-full justify-center">
                        <div className={`w-48 h-32 border-2 rounded-lg flex flex-col items-center justify-center transition-colors ${getStatusStyle(machines[0].status)}`}>
                            <span className="font-bold text-slate-800">{machines[0].name}</span>
                            <span className="text-sm font-medium mt-1">{machines[0].id}</span>
                        </div>
                        <div className={`w-48 h-32 border-2 rounded-lg flex flex-col items-center justify-center transition-colors ${getStatusStyle(machines[1].status)}`}>
                            <span className="font-bold text-slate-800">{machines[1].name}</span>
                            <span className="text-sm font-medium mt-1">{machines[1].id}</span>
                        </div>
                        <div className={`w-48 h-32 border-2 rounded-lg flex flex-col items-center justify-center transition-colors ${getStatusStyle(machines[2].status)}`}>
                            <span className="font-bold text-slate-800">{machines[2].name}</span>
                            <span className="text-sm font-medium mt-1">{machines[2].id}</span>
                        </div>
                    </div>

                    {/* Middle Row */}
                    <div className="flex gap-6 w-full justify-center">
                        <div className={`w-96 h-32 border-2 rounded-lg flex flex-col items-center justify-center transition-colors ${getStatusStyle(machines[3].status)}`}>
                            <span className="font-bold text-slate-800">{machines[3].name}</span>
                            <span className="text-sm font-medium mt-1">{machines[3].id}</span>
                        </div>
                        <div className={`w-48 h-32 border-2 rounded-lg flex flex-col items-center justify-center transition-colors ${getStatusStyle(machines[4].status)}`}>
                            <span className="font-bold text-slate-800">{machines[4].name}</span>
                            <span className="text-sm font-medium mt-1">{machines[4].id}</span>
                        </div>
                        <div className={`w-32 h-32 border-2 rounded-lg flex flex-col items-center justify-center transition-colors ${getStatusStyle(machines[5].status)}`}>
                            <span className="font-bold text-slate-800 text-center">{machines[5].name}</span>
                            <span className="text-sm font-medium mt-1">{machines[5].id}</span>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="flex gap-6 w-full justify-start pl-24">
                        <div className={`w-48 h-32 border-2 rounded-lg flex flex-col items-center justify-center transition-colors ${getStatusStyle(machines[6].status)}`}>
                            <span className="font-bold text-slate-800">{machines[6].name}</span>
                            <span className="text-sm font-medium mt-1">{machines[6].id}</span>
                        </div>
                        <div className={`w-48 h-32 border-2 rounded-lg flex flex-col items-center justify-center transition-colors ${getStatusStyle(machines[7].status)}`}>
                            <span className="font-bold text-slate-800">{machines[7].name}</span>
                            <span className="text-sm font-medium mt-1">{machines[7].id}</span>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-8 mt-8">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border-2 border-status-success/30 bg-status-success/10 text-status-success flex items-center justify-center text-[8px] font-bold">✓</div>
                        <span className="text-xs font-bold text-status-success uppercase tracking-wide">Normal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border-2 border-status-warning/30 bg-status-warning/10 text-status-warning flex items-center justify-center text-[8px] font-bold">!</div>
                        <span className="text-xs font-bold text-status-warning uppercase tracking-wide">Medium Waste</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border-2 border-status-critical/30 bg-status-critical/10 text-status-critical flex items-center justify-center text-[8px] font-bold">✗</div>
                        <span className="text-xs font-bold text-status-critical uppercase tracking-wide">High Waste</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
