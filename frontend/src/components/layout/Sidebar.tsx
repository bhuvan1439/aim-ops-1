"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Cpu } from "lucide-react";

export function Sidebar({ onOpenSettings }: { onOpenSettings?: () => void }) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/ai-copilot", label: "AIM-OPS Copilot", highlight: true },
    { href: "/xray-diagnostics", label: "X-Ray Diagnostics" },
    { href: "/energy-analytics", label: "Energy Analytics" },
    { href: "/production-optimization", label: "Production Optimization" },
    { href: "/machine-health", label: "Machine Health" },
    { href: "/ai-root-cause", label: "AI Root Cause Finder" },
    { href: "/golden-signature", label: "Golden Signature" },
    { href: "/digital-twin", label: "Digital Twin Simulator" },
    { href: "/energy-waste", label: "Energy Waste Heatmap" },
    { href: "/carbon-footprint", label: "Carbon Footprint" },
    { href: "/cross-factory-learning", label: "Cross-Factory Learning" },
    { href: "/ai-energy-scheduling", label: "AI Energy Scheduling" },
    { href: "/maintenance", label: "Maintenance Scheduler" },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 z-40">
      <div className="pt-6 pb-6 px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center text-accent-indigo flex-shrink-0">
            <Cpu size={18} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-accent-indigo tracking-tight">AIM-OPS</h1>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Smart Manufacturing</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const isHighlighted = (link as any).highlight;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 text-sm rounded-md transition-all flex items-center justify-between ${
                isActive
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : isHighlighted 
                    ? "bg-accent-indigo/5 text-accent-indigo hover:bg-accent-indigo/10 font-bold border border-accent-indigo/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
              }`}
            >
              <span className="flex items-center gap-2">
                {isHighlighted && <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />}
                {link.label}
              </span>
              {isHighlighted && <span className="text-[9px] uppercase tracking-widest bg-accent-indigo text-white px-1.5 py-0.5 rounded shadow-sm">New</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={onOpenSettings}
          className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-md transition-colors"
        >
          <Settings size={18} />
          Settings
        </button>
      </div>

    </aside>
  );
}
