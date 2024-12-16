'use client'

import {
    NavigationMenu,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { LineChart, BarChart, Settings } from 'lucide-react';

import Link from 'next/link'

export default function Navbar() {
    return (
        <NavigationMenu className="px-4 py-2">
            <Link href="/live-view" legacyBehavior passHref className="px-4 py-2 hover:bg-gray-100 rounded">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <LineChart className="w-4 h-4 mr-2" />
                    Live View
                </NavigationMenuLink>
            </Link>
            <Link href="/mcp" legacyBehavior passHref className="px-4 py-2 hover:bg-gray-100 rounded">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <BarChart className="w-4 h-4 mr-2" />
                    MCP View
                </NavigationMenuLink>
            </Link>
            <Link href="/settings" legacyBehavior passHref className="px-4 py-2 hover:bg-gray-100 rounded">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                </NavigationMenuLink>
            </Link>
        </NavigationMenu>
    )
}