"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from "react";
import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
import React from 'react';
import { cn } from "@/lib/utils";
// import {DBCData, loadDBCFile} from "./live-view/live-view-parser.tsx";
import {DBCParser, loadDBCFile} from './dbc/dbc-parser';
import CanSignalDisplay from "./dbc/can-signal-display.tsx";
import DBCViewer from "./dbc/page.tsx";
// import {loadDBCFile, DBCData, Message, Signal} from './live-view-parser';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/atoms/ui/navigation-menu";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/atoms/ui/card"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [grid, setGrid] = useState(null);
    const wsRef = useRef(null);

    const pathname = usePathname();
    const isActive = (href) => pathname === href;

    const [dbcData, setDbcData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDBC = async () => {
            try {
                const data = await loadDBCFile('/api/dbc/input.dbc'); // Pfad zur API-Route anpassen
                console.log(data);
                setDbcData(data);
            } catch (err) {
                setError('Fehler beim Laden der DBC-Datei Grid');
            }
        };
        fetchDBC();
    }, []);

    if (error) {
        return (
            <div className="p-4 text-red-600">
                {error}
            </div>
        );
    }


    useEffect(() => {
        // Create WebSocket connection
        wsRef.current = new WebSocket('ws://192.168.70.6:8080/ws'); // Adjust the URL to match your Go backend

        wsRef.current.onopen = () => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
        };

        wsRef.current.onclose = () => {
            console.log('Disconnected from WebSocket');
            setIsConnected(false);
        };

        wsRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
        };

        wsRef.current.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg['id'] != null) { // Assuming the Go backend sends messages with a type field
                    setMessages(prevMessages => [...prevMessages, msg]);
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        // Cleanup on unmount
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const gridInstance = GridStack.init({
                float: true,
                removable: true,
                removeTimeout: 100,
                margin: 10,
                cellHeight: 300,
                minRow: 2
            });
            setGrid(gridInstance);

            return () => {
                gridInstance.destroy();
            };
        }
    }, []);

    const saveLayout = () => {
        const layout = JSON.stringify(items);
        localStorage.setItem('dashboard-layout', layout);
        alert('Layout gespeichert!');
    };

    const loadLayout = () => {
        const layout = localStorage.getItem('dashboard-layout');
        if (layout) {
            setItems(JSON.parse(layout));
        }
    };

    const clearAll = () => {
        if (grid) {
            grid.removeAll();
            setItems([]);
        }
    };

    // Optional: Implement reconnection logic
    const reconnect = () => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
            wsRef.current = new WebSocket('ws://192.168.70.6:8080/ws');
        }
    };

    return (
        <div>
            <NavigationMenu className="!max-w-full !block">
                <NavigationMenuList>
                    <NavigationMenuItem className={cn("flex-1", isActive('/') ? 'bg-accent text-accent-foreground' : 'bg-muted')}>
                        <Link href="/">Home</Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className={cn("flex-1", isActive('/upload') ? 'bg-accent text-accent-foreground' : 'bg-muted')}>
                        <Link href="/upload">Image Upload</Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className={cn("flex-1", isActive('/settings') ? 'bg-accent text-accent-foreground' : 'bg-muted')}>
                        <Link href="/settings">Settings</Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Home
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/liveView" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Live View
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className={navigationMenuTriggerStyle()}>
                        <Link href="/settings" legacyBehavior passHref>
                            <NavigationMenuLink>
                                Settings
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <p>Status: {isConnected ? "connected" : "disconnected"}</p>
            {!isConnected && (
                <button
                    onClick={reconnect}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Reconnect
                </button>
            )}

            <div>
                <button
                    onClick={clearAll}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Alle löschen
                </button>
                <button
                    onClick={saveLayout}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Layout speichern
                </button>
                <button
                    onClick={loadLayout}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Layout laden
                </button>

                <DBCViewer></DBCViewer>

                <div className="grid-stack">

                    <div className="grid-stack-item" gs-w="8" gs-h="1">
                        <div className="grid-stack-item-content">
                            <Card className="p-4 font-mono h-full">
                            <table>
                                <thead>
                                <tr>
                                    <th>CAN ID</th>
                                    <th>Timestamp</th>
                                    <th>Data</th>
                                </tr>
                                </thead>
                                <tbody>
                                {messages.map((message, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{message.id.toString(16).padStart(3, '0').toUpperCase()}</td>
                                            <td>{message.timestamp}</td>
                                            <td>{Array.from(message.data.slice(0, message.length))
                                                .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
                                                .join(' ')}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                            </Card>
                        </div>
                    </div>
                    <div className="grid-stack-item bg-white" gs-w="3">
                        <div className="grid-stack-item-content bg-white">
                            <Card className="p-4 h-full">
                                <CanSignalDisplay
                                    canMessages={messages}
                                    dbcMessage={dbcData ? dbcData.messages[0] : null}
                                />
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}