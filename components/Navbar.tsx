'use client'

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LineChart, Settings } from 'lucide-react';
import Link from 'next/link';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface Assignment {
    CANSocket: string;
    DBCFile: string;
    YAMLFile: string;
}

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const [canItems, setCanItems] = useState<{ href: string, text: string }[]>([]);
    const pathname = usePathname();

    useEffect(() => {
        async function fetchCanData() {
            const response = await fetch("/assignments");
            const jsonData = await response.json();
            const items = jsonData.map((item: Assignment) => ({
                href: `/live-view#${item.CANSocket}`,
                text: item.CANSocket
            }));
            setCanItems(items);
        }

        fetchCanData();
        setMounted(true);
    }, []);

    const currentCAN = canItems.find(item => item.href === pathname)?.text || 'Live View';

    const handleCanClick = (href: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.href = href;
    };

    return (
        <div className="w-full max-w-full flex justify-between px-4 py-2 bg-gray-50 border-b">
            {mounted ? (
                <>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    <LineChart className="w-4 h-4 mr-2"/>
                                    {currentCAN}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    {canItems.map((item, index) => (
                                        <NavigationMenuLink
                                            key={index}
                                            onClick={handleCanClick(item.href)}
                                            className={`w-20 block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer ${
                                                pathname === item.href ? 'bg-accent text-accent-foreground' : ''
                                            }`}
                                        >
                                            {item.text}
                                        </NavigationMenuLink>
                                    ))}
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href="/settings" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        <Settings className="w-4 h-4 mr-2"/>
                                        Settings
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    <div className="font-bold text-right text-2xl px-4 py-1.5 text-blue-600 self-center">
                        Yellow Pirat
                    </div>
                    <div className="font-bold text-right text-xl px-4 py-2">
                        CAN Datenlogger
                    </div>
                </>
            ) : (
                <>
                    <div className="flex gap-2">
                        <div className="w-28 h-9 bg-gray-200 rounded animate-pulse" />
                        <div className="w-24 h-9 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="w-32 h-8 bg-gray-200 rounded animate-pulse self-center" />
                    <div className="w-32 h-8 bg-gray-200 rounded animate-pulse self-center" />
                </>
            )}
        </div>
    );
}