import React from 'react';
import { Button } from "@/components/ui/button";
import { LineChart, BarChart, Settings } from 'lucide-react';
import { cn } from "@/lib/utils";

const SidebarNav = ({ className, activePage, onPageChange, ...props }) => {
  const navItems = [
    {
      title: "Live View",
      icon: LineChart,
      href: "/live",
      id: "live"
    },
    {
      title: "MCAP View",
      icon: BarChart,
      href: "/mcap",
      id: "mcap"
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
      id: "settings"
    }
  ];

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={activePage === item.id ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onPageChange(item.id)}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Button>
      ))}
    </nav>
  );
};

export default SidebarNav;