"use client";

export default function AIEnergyScheduling() {
    // 0-7: Off-Peak (Green), 8-17: Peak (Red), 18-22: Mid (Yellow), 23: Off-Peak (Green)
    const hours = Array.from({ length: 24 }, (_, i) => {
        let status = 'green';
        if (i >= 8 && i <= 17) status = 'red';
        else if (i >= 18 && i <= 22) status = 'yellow';
        return { hour: i, status };
    });

    const schedulingData = [
        { machine: "CNC Mill Alpha", current: "Day", optimal: "Night", savings: "18%", priority: "HIGH" },
        { machine: "Injection Molder B", current: "Day", optimal: "Night", savings: "24%", priority: "HIGH" },
        { machine: "Press Unit C", current: "Night", optimal: "Night", savings: "0%", priority: "LOW" },
        { machine: "Assembly Line D", current: "Day", optimal: "Afternoon", savings: "8%", priority: "MEDIUM" },
        { machine: "Welding Station E", current: "Afternoon", optimal: "Night", savings: "15%", priority: "HIGH" },
    ];

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">AI Energy Scheduling</h2>
                <p className="text-sm text-slate-500 mt-1">Optimized machine scheduling to reduce energy costs</p>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-8">
                {/* Energy Price Timeline */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Energy Price By Hour</h3>
                    <div className="flex w-full mb-3">
                        {hours.map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col pt-10 relative">
                                <div className={`h-10 w-full border-r border-white/20 ${
                                    h.status === 'green' ? 'bg-status-success/15' :
                                    h.status === 'red' ? 'bg-status-critical/15' : 'bg-status-warning/15'
                                } ${i === 0 ? 'rounded-l-sm' : ''} ${i === 23 ? 'rounded-r-sm' : ''}`} />
                                <span className="text-[10px] text-slate-400 font-semibold absolute top-0 left-1/2 -translate-x-1/2 mt-1">{h.hour}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 bg-status-success/60 rounded-[2px]" />
                            <span className="text-xs font-bold text-status-success">Off-Peak (Low Cost)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 bg-status-warning/60 rounded-[2px]" />
                            <span className="text-xs font-bold text-status-warning">Mid</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 bg-status-critical/60 rounded-[2px]" />
                            <span className="text-xs font-bold text-status-critical">Peak (High Cost)</span>
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* Scheduling Table */}
                <div className="w-full">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Machine</th>
                                <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Current</th>
                                <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-wider">AI Optimal</th>
                                <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Savings</th>
                                <th className="pb-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50">
                            {schedulingData.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 text-sm font-medium text-slate-700">{row.machine}</td>
                                    <td className="py-4 text-sm font-medium text-slate-600">{row.current}</td>
                                    <td className="py-4 text-sm font-bold text-accent-blue">{row.optimal}</td>
                                    <td className="py-4 text-sm font-bold text-status-success">{row.savings}</td>
                                    <td className="py-4 text-xs font-bold tracking-wider">
                                        <span className={`${
                                            row.priority === 'HIGH' ? 'text-status-success' :
                                            row.priority === 'MEDIUM' ? 'text-status-warning' : 'text-slate-400'
                                        }`}>{row.priority}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI Insight Box */}
            <div className="bg-surface p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <h3 className="text-xs font-bold text-accent-blue uppercase tracking-wider mb-4">AI Recommendation</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    Shifting high-energy machines to <span className="text-status-success font-bold">night shift (10PM-6AM)</span> can reduce total energy costs by <span className="text-status-success font-bold">~22%</span>. Peak hours should be reserved for low-consumption tasks.
                </p>
            </div>
        </div>
    );
}
