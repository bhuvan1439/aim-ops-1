"use client";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MachineHealth() {
    const machines = [
        { name: "CNC Mill Alpha", id: "Machine A", score: 92, temp: "72°C", vibration: "0.4 mm/s", status: "success" },
        { name: "Injection Molder B", id: "Machine B", score: 65, temp: "88°C", vibration: "1.2 mm/s", status: "warning", alert: "Maintenance predicted within 48h" },
        { name: "Press Unit C", id: "Machine C", score: 30, temp: "105°C", vibration: "3.8 mm/s", status: "critical", alert: "Maintenance predicted within 48h" },
        { name: "Assembly Line D", id: "Machine D", score: 88, temp: "68°C", vibration: "0.3 mm/s", status: "success" },
        { name: "Welding Station E", id: "Machine E", score: 78, temp: "82°C", vibration: "0.9 mm/s", status: "accent-blue" },
        { name: "Packaging Unit F", id: "Machine F", score: 95, temp: "55°C", vibration: "0.2 mm/s", status: "success" },
    ];

    const tempTrendData = [
        { time: "0", temp: 70 }, { time: "1", temp: 71 }, { time: "2", temp: 72 }, { time: "3", temp: 88 },
        { time: "4", temp: 89 }, { time: "5", temp: 73 }, { time: "6", temp: 87 }, { time: "7", temp: 88 },
        { time: "8", temp: 82 }, { time: "9", temp: 80 }, { time: "10", temp: 76 }, { time: "11", temp: 87.3 }, // Current tooltip
        { time: "12", temp: 84 }, { time: "13", temp: 86 }, { time: "14", temp: 87 }, { time: "15", temp: 99 },
        { time: "16", temp: 92 }, { time: "17", temp: 86 }, { time: "18", temp: 104 }, { time: "19", temp: 97 },
    ];

    const vibrationTrendData = [
        { time: "0", temp: 0.6 }, { time: "1", temp: 0.7 }, { time: "2", temp: 0.4 }, { time: "3", temp: 0.8 },
        { time: "4", temp: 0.9 }, { time: "5", temp: 0.7 }, { time: "6", temp: 0.8 }, { time: "7", temp: 1.1 },
        { time: "8", temp: 0.9 }, { time: "9", temp: 0.5 }, { time: "10", temp: 0.7 }, { time: "11", temp: 0.8 },
        { time: "12", temp: 0.9 }, { time: "13", temp: 0.8 }, { time: "14", temp: 1.1 }, { time: "15", temp: 0.7 },
        { time: "16", temp: 2.7 }, { time: "17", temp: 2.5 }, { time: "18", temp: 2.4 }, { time: "19", temp: 2.8 },
    ];

    const getStatusStyle = (status: string) => {
        if (status === 'success') return "bg-status-success/10 text-status-success";
        if (status === 'warning') return "bg-status-warning/10 text-status-warning";
        if (status === 'critical') return "bg-status-critical/10 text-status-critical";
        return "bg-accent-blue/10 text-accent-blue";
    };

    const getAlertStyle = (status: string) => {
        if (status === 'warning') return "bg-status-warning/10 border-status-warning/20 text-status-warning";
        return "bg-status-critical/10 border-status-critical/20 text-status-critical";
    };

    const CustomTooltipTemp = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-slate-200 p-2 shadow-sm rounded-sm">
                    <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
                    <p className="text-sm font-bold text-status-warning">temp : {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Machine Health Monitoring</h2>
                <p className="text-sm text-slate-500 mt-1">Real-time health indices and sensor data</p>
            </div>

            {/* Machine Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {machines.map((machine, idx) => (
                    <div key={idx} className="bg-surface p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-base font-bold text-slate-800">{machine.name}</h3>
                                <p className="text-xs font-medium text-slate-400">{machine.id}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusStyle(machine.status)}`}>
                                <span className="text-lg font-black">{machine.score}</span>
                            </div>
                        </div>

                        <div className="flex gap-12 mt-2">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Temp</span>
                                <span className={`text-sm font-bold ${machine.status === 'critical' ? 'text-status-warning' : 'text-slate-700'}`}>{machine.temp}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vibration</span>
                                <span className={`text-sm font-bold ${machine.status === 'critical' ? 'text-status-critical' : 'text-slate-700'}`}>{machine.vibration}</span>
                            </div>
                        </div>

                        {machine.alert && (
                            <div className={`mt-2 p-2 rounded text-xs font-bold border ${getAlertStyle(machine.status)}`}>
                                ⚠ {machine.alert}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Detailed Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[320px]">
                {/* Temperature Trend */}
                <div className="bg-surface p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Temperature Trend (Machine C)</h3>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={tempTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#E2E8F0" />
                                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={true} tickLine={true} />
                                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={true} tickLine={true} domain={[0, 120]} ticks={[0, 30, 60, 90, 120]} />
                                <Tooltip content={<CustomTooltipTemp />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}/>
                                <Line type="monotone" dataKey="temp" stroke="var(--color-status-warning)" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Vibration Trend */}
                <div className="bg-surface p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Vibration Trend (Machine C)</h3>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={vibrationTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#E2E8F0" />
                                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={true} tickLine={true} />
                                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={true} tickLine={true} domain={[0, 3.2]} ticks={[0, 0.8, 1.6, 2.4, 3.2]} />
                                <Line type="monotone" dataKey="temp" stroke="var(--color-status-critical)" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
