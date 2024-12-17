'use client';

import React, { useState, useEffect } from 'react';

// import { loadDBCFile, DBCData } from './dbc-parser';

import Sidebar from './Sidebar'
import GridView from './GridView'
import { loadDBCFile, DBCData } from '@/components/DBCParser/DBCParser';

export default function LiveView() {
    const [dbcData, setDbcData] = useState<DBCData | null>(null);
    const [isWSConnected, setIsWSConnected] = useState(false);
    const [shouldWSReconnect, setShouldWSReconnect] = useState(false);
    const [shouldClearMessages, setShouldClearMessages] = useState(false);
    const [wantLiveUpdate, setWantLiveUpdate] = useState(true);

    useEffect(() => {
        const fetchDBC = async () => {
            try {
                const data = await loadDBCFile('/api/dbc/input.dbc');
                if (data) {
                    setDbcData(data);
                }

            } catch (err) {
                console.log(err);
                // setError('Fehler beim Laden der DBC-Datei');
            }
        };
        fetchDBC();
    }, []);

    return (
        <div className="flex h-[calc(100vh-64px)]">
            <Sidebar isWSConnected={isWSConnected}
                     setShouldWSReconnect={setShouldWSReconnect}
                     wantLiveUpdate={wantLiveUpdate}
                     setWantLiveUpdate={setWantLiveUpdate}
                     setShouldClearMessages={setShouldClearMessages}
                     dbcData={dbcData}
            />
            <GridView isWSConnected={isWSConnected}
                      setIsWSConnected={setIsWSConnected}
                      shouldWSReconnect={shouldWSReconnect}
                      setShouldWSReconnect={setShouldWSReconnect}
                      wantLiveUpdate={wantLiveUpdate}
                      dbcData={dbcData}
                      shouldClearMessages={shouldClearMessages}
                      setShouldClearMessages={setShouldClearMessages}
            />
        </div>
    )
}