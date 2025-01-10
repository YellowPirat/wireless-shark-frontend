'use client'

import {
    NavigationMenu,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { LineChart, Settings } from 'lucide-react';

import Link from 'next/link'

export default function Navbar() {
    return (
        <div className="w-full max-w-full flex justify-between px-4 py-2 bg-gray-50 border-b">
            <NavigationMenu className="">
                <Link href="/live-view/vcan0" legacyBehavior passHref className="px-4 py-2 hover:bg-gray-100 rounded">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <LineChart className="w-4 h-4 mr-2"/>
                        Live 0
                    </NavigationMenuLink>
                </Link>
                <Link href="/live-view/vcan1" legacyBehavior passHref className="px-4 py-2 hover:bg-gray-100 rounded">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <LineChart className="w-4 h-4 mr-2"/>
                        Live 1
                    </NavigationMenuLink>
                </Link>
                <Link href="/live-view/vcan2" legacyBehavior passHref className="px-4 py-2 hover:bg-gray-100 rounded">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <LineChart className="w-4 h-4 mr-2"/>
                        Live 2
                    </NavigationMenuLink>
                </Link>
                <Link href="/live-view/vcan3" legacyBehavior passHref className="px-4 py-2 hover:bg-gray-100 rounded">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <LineChart className="w-4 h-4 mr-2"/>
                        Live 3
                    </NavigationMenuLink>
                </Link>
                <Link href="/live-view/vcan4" legacyBehavior passHref className="px-4 py-2 hover:bg-gray-100 rounded">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <LineChart className="w-4 h-4 mr-2"/>
                        Live 4
                    </NavigationMenuLink>
                </Link>
                <Link href="/live-view/vcan5" legacyBehavior passHref className="px-4 py-2 hover:bg-gray-100 rounded">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <LineChart className="w-4 h-4 mr-2"/>
                        Live 5
                    </NavigationMenuLink>
                </Link>
                <Link href="/settings" legacyBehavior passHref className="px-4 py-2 hover:bg-gray-100 rounded">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <Settings className="w-4 h-4 mr-2"/>
                        Settings
                    </NavigationMenuLink>
                </Link>

            </NavigationMenu>
            <div className={"font-bold text-right text-2xl px-4 py-1.5 text-blue-600 self-center"}>
                Yellow Pirat
            </div>
            <div className={"font-bold text-right text-xl px-4 py-2"}>
                CAN Datenlogger
            </div>
        </div>
    )
}