"use client";
import { useState, useEffect, useRef } from "react";
import { Bot, User, Sparkles, Send, Loader2, ArrowRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Message = {
    id: string;
    role: "assistant" | "user";
    content: React.ReactNode;
    isStreaming?: boolean;
};

const predefinedQueries = [
    "Analyze Batch T040 anomaly",
    "What is the projected energy savings vs baseline?",
    "Show root causes for recent Friability drops",
    "Evaluate Machine Health Index degradation over Q3",
    "Optimize energy plan for incoming High-Yield batch"
];

// Mock streaming responses
const mockResponses: Record<string, { text: string; chart?: any[] }> = {
    "Analyze Batch T040 anomaly": {
        text: "Analyzing historical telemetry for Batch T040...\n\nI have detected a critical multi-variate anomaly beginning at T+114m. \n\n• The primary driver (68% SHAP impact) was an uncommanded `Temperature_C` spike to 84.1°C.\n• This induced a secondary `Vibration_mm_s` resonance cascade peaking at 8.2mm/s.\n\nRecommendation: The XGBoost model predicts a 94% chance of product rejection due to excessive hardness. I recommend aborting the batch to save 42.1 kWh of wasted energy.",
        chart: [
            { time: "110m", temp: 75, vib: 4.1 },
            { time: "112m", temp: 76, vib: 4.3 },
            { time: "114m", temp: 82, vib: 6.8 },
            { time: "116m", temp: 84, vib: 8.2 },
            { time: "118m", temp: 83, vib: 7.9 },
        ]
    },
    "What is the projected energy savings vs baseline?": {
        text: "Based on the current XGBoost optimization parameters, the Golden Signature tracking has resulted in significant efficiency gains.\n\n• Current Average Load: 114 kWh/batch\n• Historic Baseline: 145 kWh/batch\n• Net Reduction: -21.3%\n\nIf this schedule is maintained, projected annual savings equate to $142,500 USD and an offset of 312 metric tons of CO2.",
    },
    "Show root causes for recent Friability drops": {
        text: "Running SHAP (SHapley Additive exPlanations) analysis on the last 50 batches regarding Friability scores < 0.82.\n\nTop contributing factors:\n1. Low Compaction Force (45% contribution) - typically below 12kN.\n2. Machine Speed too high (30% contribution) - dwell time insufficient.\n3. Ambient Humidity (15% contribution).\n\nActionable Insight: Reduce `Machine_Speed_RPM` by 5% and increase `Compaction_Force_kN` by 2.5% to return to the Golden Signature envelope."
    },
    "Evaluate Machine Health Index degradation over Q3": {
        text: "Scanning maintenance logs and telemetry from July 1 to Sept 30...\n\nMachine Health Index for Unit 04 degraded from 94 to 87.\n\nKey Degradation Drivers:\n• Bearing wear in the main spindle (Vibration baseline shifted from 2.1 mm/s to 3.8 mm/s).\n• Cooling system inefficiency (Average operating temp shifted +4.2°C).\n\nRecommendation: Schedule Class B Maintenance during the next weekend shutdown to replace spindle bearings and flush the coolant lines. This will restore the index to ~95 and prevent critical failure."
    },
    "Optimize energy plan for incoming High-Yield batch": {
        text: "Generating energy optimization profile for High-Yield parameter set...\n\nTo minimize carbon footprint while meeting the High-Yield timeline constraints:\n\n1. Pre-heat phase: Shift sequence earlier to align with off-peak grid pricing (Save 12%).\n2. Curing phase: Implement dynamic pulse heating rather than continuous draw. SHAP analysis confirms this will not affect yield quality.\n\nExpected Outcome: 8.5% total energy reduction per batch, saving 11 kWh while maintaining target specifications."
    }
};

const defaultResponse = { text: "I am AIM-OPS Copilot. I am currently operating in a sandbox environment and can only respond to predefined diagnostic queries regarding the active factory dataset." };

export default function AICopilot() {
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", role: "assistant", content: "Hello, Operator. I am AIM-OPS Copilot, your Enterprise Industrial AI. How can I assist you with process optimization today?" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    const handleSend = (text: string) => {
        if (!text.trim()) return;

        setInputValue("");
        const userMsgId = Date.now().toString();
        setMessages(prev => [...prev, { id: userMsgId, role: "user", content: text }]);
        setIsThinking(true);

        // Simulate network delay
        setTimeout(() => {
            setIsThinking(false);
            const responseData = mockResponses[text] || defaultResponse;
            streamResponse(responseData.text, responseData.chart);
        }, 1200);
    };

    const streamResponse = (fullText: string, chartData?: any[]) => {
        const botMsgId = (Date.now() + 1).toString();
        let currentIndex = 0;
        
        // Add empty message first
        setMessages(prev => [...prev, { id: botMsgId, role: "assistant", content: "", isStreaming: true }]);

        const interval = setInterval(() => {
            currentIndex += 2; // Speed of typing
            if (currentIndex >= fullText.length) {
                clearInterval(interval);
                // Finalize text and inject chart if available
                setMessages(prev => prev.map(msg => 
                    msg.id === botMsgId ? { 
                        ...msg, 
                        isStreaming: false, 
                        content: (
                            <div className="flex flex-col gap-4">
                                <p className="whitespace-pre-wrap leading-relaxed">{fullText}</p>
                                {chartData && (
                                    <div className="mt-4 p-4 bg-background/50 rounded-xl border border-slate-200/50 h-[200px] w-full max-w-md">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Anomaly Sensor Trace (T+110m to T+118m)</p>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <XAxis dataKey="time" hide />
                                                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                                <Area type="monotone" dataKey="temp" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} strokeWidth={2} name="Temperature °C" />
                                                <Area type="monotone" dataKey="vib" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} strokeWidth={2} name="Vibration mm/s" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        )
                    } : msg
                ));
            } else {
                // Update streaming text
                const currentText = fullText.slice(0, currentIndex);
                setMessages(prev => prev.map(msg => 
                    msg.id === botMsgId ? { ...msg, content: <p className="whitespace-pre-wrap leading-relaxed">{currentText} <span className="inline-block w-2 h-4 bg-accent-blue animate-pulse ml-1 align-middle" /></p> } : msg
                ));
            }
        }, 30);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-surface border border-slate-200 rounded-xl shadow-xl overflow-hidden backdrop-blur-3xl">
            {/* Header */}
            <div className="flex items-center gap-3 p-5 border-b border-slate-200 bg-white/40">
                <div className="w-10 h-10 rounded-xl bg-accent-indigo text-white flex items-center justify-center shadow-md">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">AIM-OPS Copilot</h2>
                    <p className="text-xs font-semibold text-accent-indigo">Generative Diagnostic Intelligence</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col no-scrollbar">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-accent-indigo'}`}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={18} />}
                        </div>
                        <div className={`p-4 rounded-2xl shadow-sm text-sm ${msg.role === 'user' ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                            {typeof msg.content === 'string' ? <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p> : msg.content}
                        </div>
                    </div>
                ))}
                
                {isThinking && (
                    <div className="flex gap-4 max-w-[85%] self-start">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm bg-white border border-slate-200 text-accent-indigo">
                            <Bot size={18} />
                        </div>
                        <div className="p-4 rounded-2xl shadow-sm bg-white border border-slate-200 text-slate-500 rounded-tl-none flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin text-accent-blue" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Analyzing Context...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Queries */}
            <div className="px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-200/50 bg-white/20">
                {predefinedQueries.map((q, i) => (
                    <button 
                        key={i}
                        onClick={() => handleSend(q)}
                        disabled={isThinking || messages[messages.length-1]?.isStreaming}
                        className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-accent-blue hover:text-accent-blue text-slate-600 rounded-full text-xs font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {q} <ArrowRight size={12} />
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200 bg-white/40">
                <div className="flex items-center gap-3 relative">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                        placeholder="Ask Copilot to analyze telemetry, recommend optimizations, or trace root causes..."
                        className="flex-1 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-3 shadow-sm outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all placeholder:text-slate-400"
                        disabled={isThinking || messages[messages.length-1]?.isStreaming}
                    />
                    <button 
                        onClick={() => handleSend(inputValue)}
                        disabled={isThinking || messages[messages.length-1]?.isStreaming || !inputValue.trim()}
                        className="absolute right-2 p-2 bg-accent-blue text-white rounded-lg shadow-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <div className="px-1 mt-2 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>AIM-OPS LLM v2.1 • Production Sandbox</span>
                    <span>Press Enter to send</span>
                </div>
            </div>
        </div>
    );
}
