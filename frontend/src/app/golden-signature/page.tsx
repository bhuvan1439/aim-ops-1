"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function GoldenSignature() {
    const tableData = [
        { parameter: "Temperature", golden: "185°C", current: "192°C", deviation: "+3.8%", devStatus: "warning" },
        { parameter: "Pressure", golden: "2.4 bar", current: "2.35 bar", deviation: "-2.1%", devStatus: "success" },
        { parameter: "Cycle Time", golden: "45 min", current: "48 min", deviation: "+6.7%", devStatus: "warning" },
        { parameter: "Energy", golden: "125 kWh", current: "138 kWh", deviation: "+10.4%", devStatus: "critical" },
        { parameter: "Quality Yield", golden: "99.2%", current: "96.5%", deviation: "-2.7%", devStatus: "warning" },
    ];

    const chartData = [
        { batch: "B1", golden: 125, current: 140 },
        { batch: "B3", golden: 125, current: 138 },
        { batch: "B6", golden: 125, current: 155 }, // Higher energy
        { batch: "B8", golden: 125, current: 130 },
        { batch: "B11", golden: 125, current: 160 }, // Higher energy
        { batch: "B13", golden: 125, current: 145 },
        { batch: "B16", golden: 125, current: 135 },
        { batch: "B19", golden: 125, current: 138 }, 
        { batch: "B21", golden: 125, current: 165 }, // Peak
        { batch: "B24", golden: 125, current: 140 },
        { batch: "B26", golden: 125, current: 150 },
        { batch: "B28", golden: 125, current: 145 },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface border border-slate-200 p-3 rounded-lg shadow-lg min-w-[120px]">
                    <p className="text-xs font-semibold text-slate-500 mb-2">{label}</p>
                    <p className="text-sm font-bold text-status-success">golden : {payload[0].value}</p>
                    <p className="text-sm font-bold text-accent-blue">current : {payload[1].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Golden Signature Benchmark</h2>
                <p className="text-sm text-slate-500 mt-1">AI-discovered optimal operating parameters</p>
            </div>

            {/* Top Alert Box */}
            <div className="bg-surface p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-status-success uppercase tracking-wider">Golden Signature Identified</span>
                </div>
                <p className="text-sm font-medium text-slate-600">
                    Optimal parameters derived from 12,847 production cycles with 99.2% quality yield.
                </p>
            </div>

            {/* Comparison Table */}
            <div className="bg-surface rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Parameter</th>
                            <th className="px-6 py-4 text-xs font-bold text-status-success uppercase tracking-wider">Golden Value</th>
                            <th className="px-6 py-4 text-xs font-bold text-accent-blue uppercase tracking-wider">Current Batch</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Deviation</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50">
                        {tableData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-5 text-sm font-medium text-slate-700">{row.parameter}</td>
                                <td className="px-6 py-5 text-sm font-bold text-status-success">{row.golden}</td>
                                <td className="px-6 py-5 text-sm font-bold text-accent-blue">{row.current}</td>
                                <td className="px-6 py-5 text-sm font-bold">
                                    <span className={
                                        row.devStatus === 'success' ? 'text-status-success' :
                                        row.devStatus === 'warning' ? 'text-status-warning' :
                                        'text-status-critical'
                                    }>{row.deviation}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Chart */}
            <div className="bg-surface p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[380px]">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Energy Deviation From Golden Signature</h3>
                <div className="flex-1 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#E2E8F0" />
                            <XAxis dataKey="batch" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }} axisLine={true} tickLine={true} tickMargin={12} />
                            <YAxis tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }} axisLine={true} tickLine={true} tickMargin={12} domain={[0, 200]} ticks={[0, 35, 70, 105, 140]} />
                            <Tooltip content={<CustomTooltip />} />
                            
                            {/* Golden Signature Line (Threshold) */}
                            <Line type="monotone" dataKey="golden" name="Golden Signature" stroke="var(--color-status-success)" strokeDasharray="4 4" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                            
                            {/* Current Batch Line */}
                            <Line type="monotone" dataKey="current" name="Current Batch" stroke="var(--color-accent-blue)" strokeWidth={2} dot={false} isAnimationActive={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                
                {/* Legend */}
                 <div className="flex items-center gap-6 mt-6 ml-6">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-0.5 border-t-2 border-dashed border-status-success" />
                        <span className="text-xs font-bold text-status-success tracking-wide">Golden Signature</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-0.5 bg-accent-blue" />
                        <span className="text-xs font-bold text-accent-blue tracking-wide">Current Batch</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
