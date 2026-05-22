import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { Logo } from "@/components/ui/logo";

const AppShell = ({ children, fullWidth = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-brand-light">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header */}
        <header className="h-16 flex items-center justify-between px-4 bg-white border-b border-gray-200 md:hidden z-30">
          <button
            onClick={toggleSidebar}
            className="p-2 text-brand-charcoal hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1"></div> {/* Spacer to maintain layout if needed, or just let menu button stay left */}
        </header>

        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-brand-light ${fullWidth ? 'pt-0 pb-8 px-0' : 'p-4 md:px-6 md:py-8'}`}>
          <div className={`${fullWidth ? 'w-full max-w-none' : 'mx-auto w-full max-w-7xl'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
