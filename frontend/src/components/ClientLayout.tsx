"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import { SettingsModal } from "@/components/SettingsModal";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const isLoginPage = pathname === "/login";
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (loading) {
      return (
          <main className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-accent-indigo border-t-transparent rounded-full animate-spin"></div>
          </main>
      );
  }

  // Only show the app chrome if the user is authenticated and not on the login page
  const showAppChrome = user && !isLoginPage;

  return showAppChrome ? (
    <>
      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
      <Topbar />
      <main className="ml-64 mt-16 p-6 min-h-[calc(100vh-4rem)] bg-background relative z-10">
        {children}
      </main>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  ) : (
    <main className="min-h-screen w-full bg-slate-50 flex items-center justify-center relative overflow-hidden">
      {children}
    </main>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}
