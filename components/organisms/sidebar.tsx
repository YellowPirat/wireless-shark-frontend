import React from 'react';
import { SidebarNav } from "@/components/molecules/sidebar-nav";

const Sidebar = () => {
  return (
    <div className="border-r bg-background/40 h-screen w-64 lg:block">
      <div className="h-full py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            CAN Logger
          </h2>
          <SidebarNav />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;