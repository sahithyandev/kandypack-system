"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Train, Truck, CheckCircle2, Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserFromToken, isStoreManager, removeToken } from "@/lib/auth";
import { Loader2 } from "lucide-react";

const navigation = [
  { name: "Incoming Deliveries", href: "/store-manager/incoming", icon: Train },
  { name: "Truck Dispatch", href: "/store-manager/dispatch", icon: Truck },
  { name: "Delivery Confirmation", href: "/store-manager/confirm", icon: CheckCircle2 },
];

export default function StoreManagerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) => pathname === href;
  const user = getUserFromToken();

  useEffect(() => {
    if (!isStoreManager()) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Truck className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold">Kandypack</span>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">{user?.username || "Store Manager"}</p>
                <p className="text-xs text-muted-foreground">{user?.workerType || "Store Manager"}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      active ? "text-primary" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Store Manager Dashboard</h1>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">System Online</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
