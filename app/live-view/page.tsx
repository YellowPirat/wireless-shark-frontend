"use client";

import React, { useState, useEffect, useRef } from 'react';
import { loadDBCFile, DBCData } from './dbc-parser';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import {CanSignalDisplay} from './can-signal-display';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/atoms/ui/card";
import { Separator } from "@/components/atoms/ui/separator";
import { Button } from "@/components/atoms/ui/button";
import { ScrollArea } from "@/components/atoms/ui/scroll-area";

export default function DBCPage() {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [dbcData, setDbcData] = useState<DBCData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const [grid, setGrid] = useState<GridStack | null>(null);

    useEffect(() => {
        const fetchDBC = async () => {
            try {
                const data = await loadDBCFile('/api/dbc/input.dbc');
                if (data) {
                    setDbcData(data);
                }

            } catch (err) {
                setError('Fehler beim Laden der DBC-Datei');
            }
        };
        fetchDBC();
    }, []);

    useEffect(() => {
        wsRef.current = new WebSocket('ws://192.168.70.6:8080/ws');
        wsRef.current.onopen = () => setIsConnected(true);
        wsRef.current.onclose = () => setIsConnected(false);
        wsRef.current.onerror = () => setIsConnected(false);

        wsRef.current.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg['id'] != null) {
                    setMessages((prev) => [...prev, msg]);
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        return () => {
            wsRef.current?.close();
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
            if (gridInstance) {
                setGrid(gridInstance);
            }

            return () => {
                if(gridInstance) {
                    gridInstance.destroy();
                }
            };
        }
    }, []);

    const clearAll = () => {
        if(grid) {
            grid?.removeAll();
            setGrid(null);
        }
    };

    if (error) {
        return <div className="p-4 text-red-600">{error}</div>;
    }

    return (
        <div className="p-4">
            <p>Status: {isConnected ? "Verbunden" : "Getrennt"}</p>
            {!isConnected && (
                <button
                    onClick={() => wsRef.current?.close()}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Reconnect
                </button>
            )}

            <button
                onClick={clearAll}
                className="bg-red-500 text-white px-4 py-2 rounded my-2"
            >
                Alle löschen
            </button>

            {dbcData ? (
                <Card className="max-w-fit">
                    <CardHeader>
                        <CardTitle>DBC Datei</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="text-sm text-gray-500">Version: {dbcData.version}</div>
                            <ScrollArea className="h-[400px] w-[350px] rounded-md border p-4">
                                {dbcData.messages.map((message, index) => (
                                    <div key={index}>
                                        <span className="font-medium">{message.name}</span>
                                        <span className="pl-2 text-sm text-gray-500">
                                            ID: {message.id}
                                        </span>
                                        {message.signals.map((signal, sigIndex) => (
                                            <div key={sigIndex} className="pl-4 rounded-md">
                                                <Separator className="my-1" />
                                                <span className="font-medium">{signal.name}</span>
                                                <span className="pl-2 pr-8 text-sm text-gray-500">
                                                    Start: {signal.startBit}
                                                </span>
                                                <Button className="p-0 bg-blue-800 text-white h-8 w-8">+</Button>
                                            </div>
                                        ))}
                                        <Separator className="my-4" />
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div>Lade DBC Daten...</div>
            )}

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
                                    {messages.map((message, i) => (
                                        <tr key={i}>
                                            <td>{message.id.toString(16).padStart(3, '0').toUpperCase()}</td>
                                            <td>{message.timestamp}</td>
                                            <td>{Array.from(message.data.slice(0, message.length))
                                                .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
                                                .join(' ')}
                                            </td>
                                        </tr>
                                    ))}
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
    );
}
