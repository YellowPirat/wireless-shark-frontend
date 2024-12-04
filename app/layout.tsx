"use client"

import React from 'react';
import Sidebar from '@/components/organisms/sidebar';
import "./globals.css";

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 ml-64 p-6">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;