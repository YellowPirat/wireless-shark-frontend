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

const canItems = [
    { href: '/live-view/can0', text: 'CAN 0' },
    { href: '/live-view/can1', text: 'CAN 1' },
    { href: '/live-view/can2', text: 'CAN 2' },
    { href: '/live-view/can3', text: 'CAN 3' },
    { href: '/live-view/can4', text: 'CAN 4' },
    { href: '/live-view/can5', text: 'CAN 5' },
];

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    // Get current CAN from pathname
    const currentCAN = canItems.find(item => item.href === pathname)?.text || 'Live View';

    useEffect(() => {
        setMounted(true);
    }, []);

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
                                        <Link
                                            key={index}
                                            href={item.href}
                                            legacyBehavior
                                            passHref
                                        >
                                            <NavigationMenuLink
                                                className={`w-20 block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                                                    pathname === item.href ? 'bg-accent text-accent-foreground' : ''
                                                }`}
                                            >
                                                {item.text}
                                            </NavigationMenuLink>
                                        </Link>
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
    )
}