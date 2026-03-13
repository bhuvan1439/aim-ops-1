"use client";
import { useState } from "react";

export default function CrossFactoryLearning() {
    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Cross-Factory Learning</h2>
                <p className="text-sm text-slate-500 mt-1">Knowledge sharing and parameter optimization across facilities</p>
            </div>

            {/* Diagram Panel */}
            <div className="bg-surface p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[450px] relative">
                
                <div className="relative w-full max-w-2xl h-[300px] flex items-center justify-center">
                    {/* SVG Connector Lines */}
                    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                        <line x1="20%" y1="70%" x2="50%" y2="20%" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6 6" />
                        <line x1="80%" y1="70%" x2="50%" y2="20%" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6 6" />
                        <line x1="20%" y1="70%" x2="80%" y2="70%" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6 6" />
                        
                        {/* Connecting to AI Hub */}
                        <line x1="50%" y1="55%" x2="50%" y2="20%" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                        <line x1="50%" y1="55%" x2="20%" y2="70%" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                        <line x1="50%" y1="55%" x2="80%" y2="70%" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                    </svg>

                    {/* Node A (Berlin) - Bottom Left */}
                    <div className="absolute top-[70%] left-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-10">
                        <div className="w-16 h-16 rounded-full bg-accent-blue/10 border-2 border-accent-blue flex items-center justify-center shadow-sm">
                            <span className="text-xl font-bold text-accent-blue">A</span>
                        </div>
                        <span className="text-sm font-bold text-slate-600">Berlin Plant</span>
                    </div>

                    {/* Node B (Munich) - Top Center */}
                    <div className="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-10">
                        <div className="w-16 h-16 rounded-full bg-accent-blue/10 border-2 border-accent-blue flex items-center justify-center shadow-sm">
                            <span className="text-xl font-bold text-accent-blue">B</span>
                        </div>
                        <span className="text-sm font-bold text-slate-600">Munich Plant</span>
                    </div>

                    {/* Node C (Hamburg) - Bottom Right */}
                    <div className="absolute top-[70%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-10">
                        <div className="w-16 h-16 rounded-full bg-accent-blue/10 border-2 border-accent-blue flex items-center justify-center shadow-sm">
                            <span className="text-xl font-bold text-accent-blue">C</span>
                        </div>
                        <span className="text-sm font-bold text-slate-600">Hamburg Plant</span>
                    </div>

                    {/* AI Central Hub */}
                    <div className="absolute top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="w-12 h-12 rounded-full bg-status-success/10 border border-status-success flex items-center justify-center shadow-sm">
                            <span className="text-xs font-bold text-status-success">AI</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Parameter Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Berlin Card */}
                <div className="bg-surface p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">Berlin Plant</h3>
                        <p className="text-xs font-medium text-slate-400">Factory A - Best Parameters</p>
                    </div>
                    <div className="flex flex-col gap-3 mt-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">Temp</span>
                            <span className="font-bold text-accent-blue">185°C</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">Pressure</span>
                            <span className="font-bold text-accent-blue">2.4 bar</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">Efficiency</span>
                            <span className="font-bold text-accent-blue">94%</span>
                        </div>
                    </div>
                </div>

                {/* Munich Card */}
                <div className="bg-surface p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">Munich Plant</h3>
                        <p className="text-xs font-medium text-slate-400">Factory B - Best Parameters</p>
                    </div>
                    <div className="flex flex-col gap-3 mt-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">Temp</span>
                            <span className="font-bold text-accent-blue">182°C</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">Pressure</span>
                            <span className="font-bold text-accent-blue">2.5 bar</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">Efficiency</span>
                            <span className="font-bold text-accent-blue">91%</span>
                        </div>
                    </div>
                </div>

                {/* Hamburg Card */}
                <div className="bg-surface p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">Hamburg Plant</h3>
                        <p className="text-xs font-medium text-slate-400">Factory C - Best Parameters</p>
                    </div>
                    <div className="flex flex-col gap-3 mt-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">Temp</span>
                            <span className="font-bold text-accent-blue">187°C</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">Pressure</span>
                            <span className="font-bold text-accent-blue">2.3 bar</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">Efficiency</span>
                            <span className="font-bold text-accent-blue">96%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Recommendation Banner */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                <h3 className="text-xs font-bold text-status-success uppercase tracking-wider">Shared Optimal Settings</h3>
                <p className="text-sm font-medium text-slate-600">
                    AI recommends: Temperature → <span className="font-bold text-accent-blue">185°C</span>, 
                    Pressure → <span className="font-bold text-accent-blue">2.4 bar</span> based on cross-factory analysis.
                </p>
            </div>
        </div>
    );
}
