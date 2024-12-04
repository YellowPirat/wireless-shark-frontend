import React from 'react';
import { Button } from "@/components/atoms/ui/button";
import { LineChart, BarChart, Settings, FolderUp, FolderOpen } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  const navItems = [
    { title: "Live View", icon: LineChart, href: "/live-view" },
    { title: "MCAP View", icon: BarChart, href: "/mcap-view" },
    { title: "Settings", icon: Settings, href: "/settings" },
    { title: "DCB Datei", icon: FolderOpen, href: "/dbc" }
  ];

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-white border-r">
      <div className="flex flex-col h-full p-4">
        <h1 className="text-xl font-bold mb-6">CAN Logger</h1>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => router.push(item.href)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;