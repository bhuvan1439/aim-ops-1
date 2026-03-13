"use client";
import React, { useState } from 'react';
import { X, Bell, Shield, Moon, Globe, Database, Smartphone, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { role } = useAuth();

  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'data' | 'security'>('general');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [isClearing, setIsClearing] = useState(false);
  const [isCleared, setIsCleared] = useState(false);

  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
    maintenanceAlerts: true,
    energyAnomalies: true
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1200);
    }, 800);
  };

  const handleClearCache = () => {
    setIsClearing(true);
    setTimeout(() => {
      setIsClearing(false);
      setIsCleared(true);
      setTimeout(() => {
        setIsCleared(false);
      }, 2000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">System Settings</h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">Manage your AIM-OPS preferences and configurations.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Layout Container */}
        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar Tabs */}
          <div className="w-64 bg-slate-50/50 border-r border-slate-100 p-4 flex flex-col gap-1 overflow-y-auto hidden md:flex">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'general' ? 'bg-white text-accent-blue shadow-sm border border-slate-100' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}
            >
              <Globe size={18} />
              General
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'notifications' ? 'bg-white text-accent-blue shadow-sm border border-slate-100' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}
            >
              <Bell size={18} />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'data' ? 'bg-white text-accent-blue shadow-sm border border-slate-100' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}
            >
              <Database size={18} />
              Data & Storage
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'security' ? 'bg-white text-accent-blue shadow-sm border border-slate-100' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}
            >
              <Shield size={18} />
              Security
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">

            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Appearance</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-accent-blue bg-accent-blue/5 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <Moon size={20} className="fill-slate-200 opacity-50" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">Light Mode</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-accent-blue bg-accent-blue/5 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-300">
                        <Moon size={20} className="fill-slate-600" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">Dark Mode</span>
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'system' ? 'border-accent-blue bg-accent-blue/5 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-800 flex items-center justify-center text-white shadow-inner">
                        <Smartphone size={20} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">System</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 font-medium">Currently using AIM-OPS theme protocol. Dark mode unlocks in upcoming pro release.</p>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Localization</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Language</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium rounded-lg px-4 py-2.5 outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20"
                      >
                        <option value="en">English (US)</option>
                        <option value="de">Deutsch</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Timezone</label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium rounded-lg px-4 py-2.5 outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20"
                      >
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                        <option value="EST">EST (Eastern Standard Time)</option>
                        <option value="CET">CET (Central European Time)</option>
                        <option value="IST">IST (Indian Standard Time)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-2">Delivery Channels</h3>

                <div className="bg-white border text-slate-800 border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <div>
                      <p className="font-bold text-sm">Push Notifications</p>
                      <p className="text-xs text-slate-500 font-medium">Receive alerts directly in the browser.</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                      className={`w-11 h-6 rounded-full transition-colors relative ${notifications.push ? 'bg-accent-blue' : 'bg-slate-300'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${notifications.push ? 'left-5.5' : 'left-0.5'}`} style={{ left: notifications.push ? 'calc(100% - 22px)' : '2px' }} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <div>
                      <p className="font-bold text-sm">Email Digest</p>
                      <p className="text-xs text-slate-500 font-medium">Daily summary of production anomalies.</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                      className={`w-11 h-6 rounded-full transition-colors relative ${notifications.email ? 'bg-accent-blue' : 'bg-slate-300'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${notifications.email ? 'left-5.5' : 'left-0.5'}`} style={{ left: notifications.email ? 'calc(100% - 22px)' : '2px' }} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-bold text-sm">SMS Alerts (Critical Only)</p>
                      <p className="text-xs text-slate-500 font-medium">Immediate text message for production halts.</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                      className={`w-11 h-6 rounded-full transition-colors relative ${notifications.sms ? 'bg-accent-blue' : 'bg-slate-300'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${notifications.sms ? 'left-5.5' : 'left-0.5'}`} style={{ left: notifications.sms ? 'calc(100% - 22px)' : '2px' }} />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-2 mt-8">Alert Subscriptions</h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors ${notifications.maintenanceAlerts ? 'bg-accent-blue border-accent-blue text-white' : 'border-slate-300 group-hover:border-slate-400'}`}>
                      {notifications.maintenanceAlerts && <Check size={14} strokeWidth={3} />}
                    </div>
                    <input type="checkbox" className="hidden" checked={notifications.maintenanceAlerts} onChange={() => setNotifications({ ...notifications, maintenanceAlerts: !notifications.maintenanceAlerts })} />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Maintenance & Repair Schedules</p>
                      <p className="text-xs text-slate-500 font-medium">Get notified when a machine requires upcoming service.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors ${notifications.energyAnomalies ? 'bg-accent-blue border-accent-blue text-white' : 'border-slate-300 group-hover:border-slate-400'}`}>
                      {notifications.energyAnomalies && <Check size={14} strokeWidth={3} />}
                    </div>
                    <input type="checkbox" className="hidden" checked={notifications.energyAnomalies} onChange={() => setNotifications({ ...notifications, energyAnomalies: !notifications.energyAnomalies })} />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Energy & Power Anomalies</p>
                      <p className="text-xs text-slate-500 font-medium">Alerts when kW spikes above historical Golden Signatures.</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="text-base font-bold text-slate-800 mb-1">Local Storage Status</h3>
                  <p className="text-sm text-slate-600 mb-4">Your browser is currently storing cached telemetry charts to improve load times.</p>

                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-700">Storage Used</span>
                    <span className="font-bold text-slate-900">42.5 MB / 500 MB</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-5">
                    <div className="h-full bg-accent-indigo w-[8.5%] rounded-full"></div>
                  </div>

                  <button
                    onClick={handleClearCache}
                    disabled={isClearing || isCleared}
                    className={`px-4 py-2 border font-bold text-sm rounded-lg shadow-sm transition-all flex items-center gap-2 ${isCleared
                        ? 'bg-status-success/10 border-status-success text-status-success'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    {isClearing && <Loader2 size={16} className="animate-spin text-slate-500" />}
                    {isCleared && <Check size={16} className="text-status-success" />}
                    {isClearing ? 'Clearing...' : isCleared ? 'Cleared' : 'Clear Cache'}
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Database Connection</h3>
                  <div className="flex items-center gap-4 p-4 border border-status-success/30 bg-status-success/5 rounded-xl">
                    <div className="w-3 h-3 rounded-full bg-status-success animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Firebase Cloud Firestore</p>
                      <p className="text-xs text-slate-600">Connected to <code className="bg-white px-1 py-0.5 rounded text-xs border border-slate-200">aim-ops-production</code></p>
                    </div>
                    <div className="ml-auto">
                      <span className="px-2.5 py-1 bg-status-success/20 text-status-success text-[10px] font-black uppercase tracking-wider rounded">Synced</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in duration-300 flex flex-col items-center justify-center text-center py-10">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <Shield size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Enterprise Security Active</h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  AIM-OPS is running with endpoint-to-endpoint encryption. Security settings are managed by your organization's IT administrator.
                </p>
                <div className="mt-8 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Shield size={16} className="text-status-success" />
                  Role: <span className="font-bold text-slate-900 capitalize">{role || "Operator"}</span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className={`px-5 py-2 w-40 flex justify-center items-center gap-2 text-sm font-bold text-white shadow-sm transition-colors rounded-lg ${isSaved
                ? 'bg-status-success'
                : 'bg-accent-blue hover:bg-blue-700'
              }`}
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            {isSaved && <Check size={16} />}
            {isSaving ? 'Saving...' : isSaved ? 'Saved!' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}
