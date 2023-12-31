"use client";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useState } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <html lang="en">
      <body>
        <div className="grid min-h-screen grid-rows-header bg-zinc-100">
          <Navbar
            onMenuButtonClick={() =>
              setSidebarOpen((prev) => (sidebarOpen === true ? false : true))
            }
          />
          <div className="grid md:grid-cols-sidebar">
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <main className="pt-16 sm:px-4 xs:px-0 my-4 overflow-hidden md:max-w-[calc(100vw_-_300px)] max-w-[100vw]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
