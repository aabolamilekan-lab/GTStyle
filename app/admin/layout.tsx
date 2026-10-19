import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Suite | GTStyle Fashion Jewelry",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-obsidian flex flex-col md:flex-row text-alabaster">
      <AdminSidebar />
      <main className="flex-1 w-full min-w-0 overflow-y-auto px-4 sm:px-8 py-8 sm:py-10 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
