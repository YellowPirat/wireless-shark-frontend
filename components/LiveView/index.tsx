'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import GridView from './GridView';
import { loadDBCFile, DBCData } from '@/components/DBCParser/DBCParser';
import { usePathname } from 'next/navigation';

interface LiveViewProps {
    canSocket: string;
}

const fetchDBCFileName = async () => {
    const pathname = usePathname(); // Holen der aktuellen URL (Pathname)
    const canSocket = pathname.split('/').pop(); // Extrahieren des CANSocket aus der URL

    try {
        const response = await fetch("http//localhost:8080/assignments"); // Pfad zu deiner JSON-Datei
        const jsonData = await response.json();
        
        // Suchen des DBCFile für den extrahierten CANSocket
        const item = jsonData.find((data: any) => data.CANSocket === canSocket);
        
        if (item) {
            return item.DBCFile; // Rückgabe des DBCFile-Namens
        } else {
            console.warn(`Kein DBCFile für CANSocket ${canSocket} gefunden.`);
            return null; // Rückgabe null, falls kein passendes DBCFile gefunden wurde
        }
    } catch (error) {
        console.error('Fehler beim Laden der JSON-Datei:', error);
        return null; // Rückgabe null im Fehlerfall
    }
};


export default function LiveView({ canSocket }: LiveViewProps) {
    const [mounted, setMounted] = useState(false);
    const [dbcData, setDbcData] = useState<DBCData | null>(null);
    const [isWSConnected, setIsWSConnected] = useState(false);
    const [shouldWSReconnect, setShouldWSReconnect] = useState(false);
    const [shouldClearMessages, setShouldClearMessages] = useState(false);
    const [wantLiveUpdate, setWantLiveUpdate] = useState(true);
    const [widgetToAdd, setWidgetToAdd] = useState<{type: string, CANID: number, signalID: number} | null>(null);
    const [shouldRemoveAllWidgets, setShouldRemoveAllWidgets] = useState(false);
    const [shouldSaveAllWidgets, setShouldSaveAllWidgets] = useState(false);
    const [shouldLoadAllWidgets, setShouldLoadAllWidgets] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchDBC = async () => {
            try {
                const dbcFileName = await fetchDBCFileName();
                if (dbcFileName) {
                    const data = await loadDBCFile(`/api/dbc/${dbcFileName}`);
                    if (data) {
                        setDbcData(data);
                    }
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchDBC();
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex h-[calc(100vh-64px)]">
            <Sidebar
                isWSConnected={isWSConnected}
                setShouldWSReconnect={setShouldWSReconnect}
                wantLiveUpdate={wantLiveUpdate}
                setWantLiveUpdate={setWantLiveUpdate}
                setShouldClearMessages={setShouldClearMessages}
                onAddWidget={(type, CANID, signalID) => setWidgetToAdd({type, CANID, signalID})}
                dbcData={dbcData}
                setShouldRemoveAllWidgets={setShouldRemoveAllWidgets}
                setShouldSaveAllWidgets={setShouldSaveAllWidgets}
                setShouldLoadAllWidgets={setShouldLoadAllWidgets}
            />
            <GridView
                isWSConnected={isWSConnected}
                setIsWSConnected={setIsWSConnected}
                shouldWSReconnect={shouldWSReconnect}
                setShouldWSReconnect={setShouldWSReconnect}
                wantLiveUpdate={wantLiveUpdate}
                shouldClearMessages={shouldClearMessages}
                setShouldClearMessages={setShouldClearMessages}
                widgetToAdd={widgetToAdd}
                setWidgetToAdd={setWidgetToAdd}
                dbcData={dbcData}
                canSocket={canSocket}
                shouldRemoveAllWidgets={shouldRemoveAllWidgets}
                setShouldRemoveAllWidgets={setShouldRemoveAllWidgets}
                shouldSaveAllWidgets={shouldSaveAllWidgets}
                setShouldSaveAllWidgets={setShouldSaveAllWidgets}
                shouldLoadAllWidgets={shouldLoadAllWidgets}
                setShouldLoadAllWidgets={setShouldLoadAllWidgets}
            />
        </div>
    );
}