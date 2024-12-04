"use client";

import React, {useState, useEffect} from 'react';
import {loadDBCFile, DBCData, Message, Signal} from './dbc-parser';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/atoms/ui/card"
import { Separator } from "@/components/atoms/ui/separator"
import { Button } from "@/components/atoms/ui/button"
import { ScrollArea } from "@/components/atoms/ui/scroll-area"

export default function DBCViewer() {
    const [dbcData, setDbcData] = useState<DBCData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDBC = async () => {
            try {
                const data = await loadDBCFile('/api/dbc/input.dbc'); // Pfad zur API-Route anpassen
                setDbcData(data);
            } catch (err) {
                setError('Fehler beim Laden der DBC-Datei Viewer');
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

    if (!dbcData) {
        return (
            <div className="p-4">
                Lade DBC Daten...
            </div>
        );
    }

    return (
        <Card className="max-w-fit">
            <CardHeader>
                <CardTitle>DBC Datei</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="text-sm text-gray-500">
                        Version: {dbcData.version}
                    </div>

                    {/*<div className="space-y-2">
                        <h3 className="text-lg font-medium">Nodes:</h3>
                        <div className="flex gap-2 flex-wrap">
                            {dbcData.nodes.map((node, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 rounded-md">
                                    {node}
                                </span>
                            ))}
                        </div>
                    </div>*/}

                    <ScrollArea className="h-[400px] w-[350px] rounded-md border p-4">
                        {dbcData.messages.map((message, index) => (
                                    <div key={index}>
                                        <span className="font-medium">{message.name}</span>
                                        <span className="pl-2 text-sm text-gray-500">
                                            ID: {message.id}{/* | Länge: {message.length} | Sender: {message.sender}*/}
                                        </span>
                                        {message.signals.map((signal, sigIndex) => (
                                            <div key={sigIndex} className="pl-4 rounded-md">
                                                <Separator className="my-1"/>
                                                <span className="font-medium">{signal.name}</span>
                                                <span className="pl-2 pr-8 text-sm text-gray-500">Start: {signal.startBit}</span>
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
    );
};