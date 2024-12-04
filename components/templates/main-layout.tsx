import React from 'react';
import { Sidebar } from "@/components/organisms/sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;