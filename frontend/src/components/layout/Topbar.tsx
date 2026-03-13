"use client";
import { useEffect, useState, useRef } from "react";
import { Bell, User, Wrench, AlertTriangle, Info, X, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export function Topbar() {
    const [time, setTime] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const { user, role, signOut } = useAuth();

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Maintenance Due Soon",
            time: "2h ago",
            desc: "CNC Milling Center requires a major overhaul in 2 days.",
            icon: Wrench,
            color: "text-accent-blue"
        },
        {
            id: 2,
            title: "Energy Spike Detected",
            time: "31m ago",
            desc: "Unit 4 is consuming 15% more energy than predicted.",
            icon: AlertTriangle,
            color: "text-status-critical"
        },
        {
            id: 3,
            title: "System Optimization",
            time: "5h ago",
            desc: "AI suggests reducing machine temperature by 3°C for efficiency.",
            icon: Info,
            color: "text-status-success"
        }
    ]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            // Format like Mar 11, 2026 12:42:44 PM
            const options: Intl.DateTimeFormatOptions = { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric', 
                hour: 'numeric', 
                minute: 'numeric', 
                second: 'numeric' 
            };
            setTime(now.toLocaleDateString('en-US', options));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="h-16 bg-surface border-b border-slate-200 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-30 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-700 text-sm">Factory Floor - Berlin</span>
                <div className="flex items-center gap-1.5 bg-status-success/10 px-2 py-0.5 rounded text-[10px] font-bold text-status-success tracking-wider uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                    System Online
                </div>
            </div>

            <div className="flex items-center gap-6">
                <span className="text-xs font-medium text-slate-500 font-mono tracking-tight">{time}</span>
                <div className="flex items-center gap-4">
                    <div className="relative" ref={notifRef}>
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`p-2 rounded-full relative transition-colors ${showNotifications ? 'bg-accent-blue/10 text-accent-blue' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                        >
                        <Bell size={18} />
                        {notifications.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-critical border-2 border-surface" />
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute top-12 right-0 w-80 bg-surface border border-slate-200 rounded-xl shadow-xl z-[40] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                                <div className="flex items-center gap-3">
                                    {notifications.length > 0 && (
                                        <button 
                                            onClick={() => setNotifications([])} 
                                            className="text-[10px] font-bold text-accent-blue uppercase tracking-wider hover:underline"
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                    <X size={14} className="text-slate-400 cursor-pointer hover:text-slate-600" onClick={() => setShowNotifications(false)} />
                                </div>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="px-5 py-8 text-center flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                                            <Bell size={24} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-700">All caught up!</p>
                                        <p className="text-xs text-slate-500 mt-1">You have no new notifications.</p>
                                    </div>
                                ) : (
                                    notifications.map((n) => (
                                        <div key={n.id} className="px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0 group">
                                            <div className="flex items-start gap-4">
                                                <div className={`mt-0.5 p-2 rounded-lg bg-slate-100 group-hover:bg-white transition-colors ${n.color}`}>
                                                    <n.icon size={16} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-bold text-slate-800">{n.title}</span>
                                                        <span className="text-[10px] font-medium text-slate-400">{n.time}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                                        {n.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="px-5 py-3 bg-slate-50/50 text-center border-t border-slate-100">
                                <button className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors">View all activity</button>
                            </div>
                        </div>
                    )}
                    </div>

                    <div className="relative" ref={userMenuRef}>
                        <div 
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full pl-1.5 pr-3 py-1 cursor-pointer hover:bg-slate-100/80 transition-all shadow-sm group"
                        >
                            <div className="w-7 h-7 rounded-full bg-accent-indigo/10 flex items-center justify-center text-accent-indigo overflow-hidden border border-accent-indigo/20">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={14} />
                                )}
                            </div>
                            <div className="flex flex-col items-start justify-center">
                                <span className="text-xs font-bold text-slate-800 leading-none mb-0.5 group-hover:text-accent-blue transition-colors">{user?.displayName?.split(' ')[0] || "Operator"}</span>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{role || "Guest"}</span>
                            </div>
                        </div>

                        {showUserMenu && (
                            <div className="absolute top-12 right-0 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-[40] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-3 border-b border-slate-100 mb-1 bg-slate-50/50">
                                    <p className="text-sm font-bold text-slate-800 truncate">{user?.displayName || "Operator User"}</p>
                                    <p className="text-[10px] font-medium text-slate-500 truncate mt-0.5">{user?.email || "Not authenticated"}</p>
                                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-200/50 border border-slate-200 w-auto">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{role || "Offline"}</span>
                                    </div>
                                </div>
                                <div className="px-2">
                                    <button 
                                        onClick={() => { setShowUserMenu(false); signOut(); }} 
                                        className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-status-critical hover:bg-status-critical/10 flex items-center gap-2 transition-colors"
                                    >
                                        <LogOut size={16} /> Sign Out Securely
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
