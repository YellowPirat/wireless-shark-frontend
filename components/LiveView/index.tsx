'use client';

import React, { useState, useEffect } from 'react';

// import { loadDBCFile, DBCData } from './dbc-parser';

import Sidebar from './Sidebar'
import GridView from './GridView'
import { loadDBCFile, DBCData } from '@/components/DBCParser/DBCParser';

export default function LiveView() {
    const [dbcData, setDbcData] = useState<DBCData | null>(null);
    const [isWSConnected, setIsWSConnected] = useState(false);

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
            <Sidebar isWSConnected={isWSConnected} dbcData={dbcData}/>
            <GridView isWSConnected={isWSConnected} setIsWSConnected={setIsWSConnected}/>
        </div>
    )
}