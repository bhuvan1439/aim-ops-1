"use client";
import { useState, useEffect } from "react";
import { 
  Calendar, AlertTriangle, CheckCircle, Filter, Plus, Wrench, User, Clock, ChevronRight, X 
} from "lucide-react";
import { db } from "@/lib/firebaseConfig";
import { collection, query, addDoc, updateDoc, doc, onSnapshot } from "firebase/firestore";

type Task = {
    id: string;
    title: string;
    priority: "high" | "medium" | "low";
    machine: string;
    description: string;
    dueDate: string;
    technician: string;
    estTime: string;
    status: "Pending" | "Scheduled" | "Completed";
};

const initialTasks: Omit<Task, 'id'>[] = [
    {
        title: "Major Overhaul",
        priority: "high",
        machine: "CNC Milling Center",
        description: "Replace spindle bearings and recalibrate axis alignment.",
        dueDate: "In 2 days",
        technician: "Sarah Chen",
        estTime: "4h 30m",
        status: "Scheduled"
    },
    {
        title: "Lubrication",
        priority: "medium",
        machine: "Injection molder",
        description: "Apply high-temp grease to primary hydraulic actuators.",
        dueDate: "In 5 days",
        technician: "Mike Ross",
        estTime: "45m",
        status: "Pending"
    },
    {
        title: "Sensor Calibration",
        priority: "low",
        machine: "Industrial Robot Arm",
        description: "Recalibrate end-effector force sensors for precision assembly.",
        dueDate: "In 8 days",
        technician: "James Wilson",
        estTime: "1h 15m",
        status: "Scheduled"
    },
    {
        title: "Belt Inspection",
        priority: "medium",
        machine: "Conveyor System",
        description: "Check for tension loss and surface wear on main drive belt.",
        dueDate: "Yesterday",
        technician: "Sarah Chen",
        estTime: "30m",
        status: "Completed"
    },
    {
        title: "Coolant Flush",
        priority: "low",
        machine: "CNC Milling Center",
        description: "Drain and replace cutting fluid, clean filtration system.",
        dueDate: "In 12 days",
        technician: "Mike Ross",
        estTime: "2h 00m",
        status: "Scheduled"
    }
];

export default function MaintenanceScheduler() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState<Partial<Task>>({
        priority: "low",
        status: "Pending",
        technician: "Unassigned"
    });

    const [activeFilter, setActiveFilter] = useState<{priority: string | null, status: string | null}>({ priority: null, status: null });
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "maintenance_tasks"));
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            if (querySnapshot.empty && tasks.length === 0) {
                // Seed database
                try {
                    for (const t of initialTasks) {
                        await addDoc(collection(db, "maintenance_tasks"), t);
                    }
                } catch (e) {
                    console.error("Failed to seed maintenance tasks", e);
                }
            } else {
                const fetchedTasks = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Task[];
                
                // Sort pending/scheduled first
                fetchedTasks.sort((a, b) => {
                    if (a.status === "Completed" && b.status !== "Completed") return 1;
                    if (a.status !== "Completed" && b.status === "Completed") return -1;
                    return 0;
                });
                
                setTasks(fetchedTasks);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleCreateTask = async () => {
        if (!newTask.title || !newTask.machine) return;
        
        await addDoc(collection(db, "maintenance_tasks"), {
            title: newTask.title,
            priority: newTask.priority || "low",
            machine: newTask.machine,
            description: newTask.description || "",
            dueDate: newTask.dueDate || "TBD",
            technician: newTask.technician || "Unassigned",
            estTime: newTask.estTime || "0h",
            status: newTask.status || "Pending"
        });
        
        setIsModalOpen(false);
        setNewTask({ priority: "low", status: "Pending", technician: "Unassigned" });
    };

    const handleStatusToggle = async (task: Task, e: React.MouseEvent) => {
        e.stopPropagation();
        const nextStatus = task.status === "Pending" ? "Scheduled" : task.status === "Scheduled" ? "Completed" : "Pending";
        await updateDoc(doc(db, "maintenance_tasks", task.id), {
            status: nextStatus
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "bg-status-critical/10 text-status-critical border-status-critical/20";
            case "medium": return "bg-status-warning/10 text-status-warning border-status-warning/20";
            case "low": return "bg-status-success/10 text-status-success border-status-success/20";
            default: return "bg-slate-100 text-slate-500 border-slate-200";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed": return "bg-status-success/10 text-status-success font-semibold";
            case "Scheduled": return "bg-accent-blue/10 text-accent-blue font-semibold";
            case "Pending": return "bg-slate-100 text-slate-500 font-semibold";
            default: return "bg-slate-100 text-slate-500";
        }
    };

    const activeTasks = tasks.filter(t => t.status !== "Completed").length;
    const completedTasks = tasks.filter(t => t.status === "Completed").length;
    const urgentTasks = tasks.filter(t => t.priority === "high" && t.status !== "Completed").length;

    const filteredTasks = tasks.filter(t => {
        if (activeFilter.priority && t.priority !== activeFilter.priority) return false;
        if (activeFilter.status && t.status !== activeFilter.status) return false;
        return true;
    });

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Maintenance Scheduler</h2>
                    <p className="text-sm text-slate-500 mt-1">Automated repair scheduling and resource allocation</p>
                </div>
                <div className="flex items-center gap-3 relative">
                    <button 
                        onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                        className={`flex items-center gap-2 px-4 py-2 bg-surface border rounded-lg text-sm font-semibold transition-all shadow-sm ${activeFilter.priority || activeFilter.status ? 'border-accent-blue text-accent-blue bg-accent-blue/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Filter size={16} />
                        Filter {(activeFilter.priority || activeFilter.status) && <span className="w-2 h-2 rounded-full bg-accent-blue ml-1"></span>}
                    </button>
                    
                    {/* Filter Dropdown */}
                    {isFilterMenuOpen && (
                        <div className="absolute top-12 left-0 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Filters</span>
                                {(activeFilter.priority || activeFilter.status) && (
                                    <button 
                                        onClick={() => { setActiveFilter({priority: null, status: null}); setIsFilterMenuOpen(false); }}
                                        className="text-[10px] font-bold text-accent-blue hover:text-blue-700 uppercase tracking-wider"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                            <div className="p-4 space-y-4">
                                {/* Priority Filter */}
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">By Priority</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['high', 'medium', 'low'].map(p => (
                                            <button 
                                                key={p}
                                                onClick={() => setActiveFilter(prev => ({...prev, priority: prev.priority === p ? null : p}))}
                                                className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${activeFilter.priority === p ? 'bg-accent-blue text-white border-accent-blue' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Status Filter */}
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">By Status</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Pending', 'Scheduled', 'Completed'].map(s => (
                                            <button 
                                                key={s}
                                                onClick={() => setActiveFilter(prev => ({...prev, status: prev.status === s ? null : s}))}
                                                className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${activeFilter.status === s ? 'bg-accent-blue text-white border-accent-blue' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-lg text-sm font-bold hover:bg-accent-blue/90 transition-all shadow-md shadow-accent-blue/20"
                    >
                        <Plus size={16} />
                        New Task
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent-blue/10 rounded-xl text-accent-blue">
                             <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next 7 Days</p>
                            <p className="text-2xl font-bold text-slate-800">{activeTasks} Tasks</p>
                        </div>
                    </div>
                </div>

                <div className="bg-surface p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-status-critical/10 rounded-xl text-status-critical">
                         <AlertTriangle size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Urgent Repairs</p>
                        <p className="text-2xl font-bold text-slate-800">{urgentTasks} Tasks</p>
                        {urgentTasks > 0 && <span className="inline-block mt-1 px-2 py-0.5 bg-status-critical/10 text-[10px] font-bold text-status-critical rounded uppercase tracking-wider">Immediate Action</span>}
                    </div>
                </div>

                <div className="bg-surface p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-status-success/10 rounded-xl text-status-success">
                         <CheckCircle size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed</p>
                        <p className="text-2xl font-bold text-slate-800">{completedTasks} Tasks</p>
                    </div>
                </div>
            </div>

            {/* Main List */}
            <div className="bg-surface rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-2">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Maintenance Records</h3>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500">Click a status badge to toggle.</span>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {filteredTasks.map((task) => (
                        <div key={task.id} className="p-6 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                            <div className="flex items-start gap-5">
                                <div className={`p-3 rounded-xl flex-shrink-0 ${task.status === 'Completed' ? 'bg-status-success/10 text-status-success' : 'bg-slate-50 text-slate-400 group-hover:bg-white transition-colors'}`}>
                                    <Wrench size={18} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-base font-bold text-slate-800">{task.title}</h4>
                                        <span className={`px-2 py-0.5 rounded border text-[10px] font-black uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-500 mb-2">
                                        {task.machine} • {task.id}
                                    </p>
                                    <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                                        {task.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-10 flex-shrink-0 ml-4">
                                    <div className="flex flex-col gap-1 w-32">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due Date</span>
                                        <div className="flex items-center gap-1.5 text-slate-700">
                                            <Calendar size={14} className="text-slate-400" />
                                            <span className="text-sm font-bold tracking-tight">{task.dueDate}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1 w-24">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Technician</span>
                                        <div className="flex items-center gap-1.5 text-slate-700">
                                            <span className="text-sm font-bold tracking-tight">{task.technician}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1 w-24">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Time</span>
                                        <div className="flex items-center gap-1.5 text-slate-700">
                                            <Clock size={14} className="text-slate-400" />
                                            <span className="text-sm font-bold tracking-tight">{task.estTime}</span>
                                        </div>
                                    </div>

                                    <div className="w-28 flex justify-center">
                                      <button 
                                        onClick={(e) => handleStatusToggle(task, e)}
                                        className={`px-3 py-1.5 rounded-lg text-xs tracking-tight hover:opacity-80 transition-opacity ${getStatusColor(task.status)}`}
                                      >
                                          {task.status}
                                      </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredTasks.length === 0 && (
                         <div className="p-12 text-center flex flex-col items-center justify-center">
                             <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                                 <Filter size={24} />
                             </div>
                             <p className="text-slate-600 font-semibold mb-1">No tasks match your filters</p>
                             <p className="text-xs text-slate-400">Try adjusting your priority or status selections.</p>
                             {(activeFilter.priority || activeFilter.status) && (
                                <button 
                                    onClick={() => setActiveFilter({priority: null, status: null})}
                                    className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors"
                                >
                                    Clear Filters
                                </button>
                             )}
                         </div>
                    )}
                </div>
            </div>

            {/* New Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-bold text-slate-800">New Maintenance Task</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Task Title</label>
                                <input 
                                    type="text" 
                                    value={newTask.title || ""} 
                                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 outline-none focus:border-accent-blue"
                                    placeholder="e.g. Belt Replacement"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Machine</label>
                                    <input 
                                        type="text" 
                                        value={newTask.machine || ""} 
                                        onChange={e => setNewTask({...newTask, machine: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 outline-none focus:border-accent-blue"
                                        placeholder="e.g. CNC Unit 04"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Priority</label>
                                    <select 
                                        value={newTask.priority || "low"} 
                                        onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 outline-none focus:border-accent-blue"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                                <textarea 
                                    value={newTask.description || ""} 
                                    onChange={e => setNewTask({...newTask, description: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 outline-none focus:border-accent-blue resize-none h-20"
                                    placeholder="Task details..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Due Date</label>
                                    <input 
                                        type="text" 
                                        value={newTask.dueDate || ""} 
                                        onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 outline-none focus:border-accent-blue"
                                        placeholder="e.g. In 3 days"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Technician</label>
                                    <input 
                                        type="text" 
                                        value={newTask.technician || ""} 
                                        onChange={e => setNewTask({...newTask, technician: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 outline-none focus:border-accent-blue"
                                        placeholder="Name"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleCreateTask}
                                disabled={!newTask.title || !newTask.machine}
                                className="px-4 py-2 bg-accent-blue text-white rounded-lg text-sm font-bold hover:bg-accent-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
