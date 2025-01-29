'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import GridView from './GridView';
import { loadDBCFile, DBCData } from '@/components/DBCParser/DBCParser';
import { usePathname } from 'next/navigation';

interface LiveViewProps {
    canSocket: string;
}

interface Assignment {
    CANSocket: string;
    DBCFile: string;
    YAMLFile: string;
}

export default function LiveView({ canSocket }: LiveViewProps) {
    const pathname = usePathname(); // Hook wird direkt in der Komponente aufgerufen
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

    // Funktion ist jetzt innerhalb der Komponente und hat Zugriff auf pathname
    const fetchDBCFileName = async () => {
        const extractedCanSocket = canSocket;

        try {
            const response = await fetch("/assignments");
            const jsonData = await response.json();
            const item = jsonData.find((data: Assignment) => data.CANSocket === extractedCanSocket);

            if (item) {
                return item.DBCFile;
            } else {
                console.warn(`Kein DBCFile für CANSocket ${extractedCanSocket} gefunden.`);
                return null;
            }
        } catch (error) {
            console.error('Fehler beim Laden der JSON-Datei:', error);
            return null;
        }
    };

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
    }, [pathname]); // pathname als Dependency hinzugefügt

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