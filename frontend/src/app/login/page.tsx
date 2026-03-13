"use client";

import React, { useState } from 'react';
import { Shield, HardHat, Briefcase, ChevronRight, UserCircle, Cpu, Mail, Lock } from 'lucide-react';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, db } from '@/lib/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const roles = [
    { id: "Labour", title: "Labour", icon: <UserCircle size={24} />, desc: "Floor-level execution and task updates." },
    { id: "Worker", title: "Worker", icon: <HardHat size={24} />, desc: "Machine operation and telemetry monitoring." },
    { id: "Manager", title: "Manager", icon: <Briefcase size={24} />, desc: "Shift scheduling and anomaly triaging." },
    { id: "Higher Official", title: "Higher Official", icon: <Shield size={24} />, desc: "Enterprise analytics and global settings." },
  ];

  const handleGoogleSignIn = async () => {
    if (!selectedRole) return;
    setIsLoggingIn(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Save their role to Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        role: selectedRole,
        email: result.user.email,
        name: result.user.displayName,
        lastLogin: new Date().toISOString()
      }, { merge: true });

      // Fallback for immediate context before Firebase syncs completely
      localStorage.setItem("pending_role", selectedRole);

      router.push("/");
    } catch (error: any) {
      console.error("Authentication failed:", error);
      alert(`Authentication failed: ${error.message}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !email || !password) return;
    setIsLoggingIn(true);

    try {
      let result;
      if (isSignUp) {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }

      await setDoc(doc(db, "users", result.user.uid), {
        role: selectedRole,
        email: result.user.email,
        name: email.split('@')[0], // Use part of email as name for email/password users
        lastLogin: new Date().toISOString()
      }, { merge: true });

      localStorage.setItem("pending_role", selectedRole);
      router.push("/");
    } catch (error: any) {
      console.error("Authentication failed:", error);
      alert(`Authentication failed: ${error.message}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-20">

      {/* Branding Side */}
      <div className="hidden md:flex flex-col justify-center px-8 border-r border-slate-200 h-full">
        <div className="w-16 h-16 rounded-2xl bg-accent-indigo/10 flex items-center justify-center text-accent-indigo mb-6">
          <Cpu size={36} />
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-tight mb-4">
          AIM-OPS <br /><span className="text-accent-indigo">Smart Manufacturing</span>
        </h1>
        <p className="text-slate-500 font-medium mb-8 max-w-sm leading-relaxed">
          Welcome to AIM-OPS Smart Manufacturing. Please authenticate using your corporate Google credentials to access the facility layout.
        </p>

        <div className="flex items-center gap-3 text-sm font-bold text-slate-400 uppercase tracking-widest mt-auto">
          <Shield size={16} /> End-to-End Encrypted Segment
        </div>
      </div>

      {/* Auth Side */}
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 flex flex-col">
        <div className="mb-8 md:hidden">
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={24} className="text-accent-indigo" />
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">AIM-OPS</h1>
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Smart Manufacturing</p>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-2">Select your clearance role</h2>
        <p className="text-sm text-slate-500 mb-8">Access levels are strictly enforced by the system.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {roles.map((r) => (
            <div
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedRole === r.id ? 'border-accent-indigo bg-accent-indigo/5 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-slate-50'}`}
            >
              <div className={`mb-3 ${selectedRole === r.id ? 'text-accent-indigo' : 'text-slate-400'}`}>
                {r.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">{r.title}</h3>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">{r.desc}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleEmailAuth} className="mb-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium rounded-xl pl-11 pr-4 py-3 outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 transition-all"
                placeholder="operator@aim-ops.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium rounded-xl pl-11 pr-4 py-3 outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedRole || isLoggingIn || !email || !password}
            className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-3 mt-2 ${(!selectedRole || isLoggingIn || !email || !password) ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-accent-indigo text-white hover:bg-indigo-700 shadow-md hover:shadow-lg hover:-translate-y-0.5'}`}
          >
            {isLoggingIn ? "Authenticating..." : (isSignUp ? "Register Account" : "Sign In Securely")}
          </button>

          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs font-bold text-accent-indigo hover:text-indigo-800 transition-colors"
            >
              {isSignUp ? "Already have an account? Sign In" : "Need an account? Register"}
            </button>
          </div>
        </form>

        <div className="relative flex items-center py-2 mb-6">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Or authenticate implicitly</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={!selectedRole || isLoggingIn}
          className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-3 ${!selectedRole || isLoggingIn ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl'}`}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className={`w-5 h-5 ${!selectedRole && 'opacity-50 grayscale'}`} />
          Continue with Google Access
        </button>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-accent-indigo/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
}
