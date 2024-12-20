'use client';

import React, { useState, useEffect } from 'react';

// import { Sidebar, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";
// import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
// import { loadDBCFile, DBCData } from './dbc-parser';

import Sidebar from './Sidebar'
import GridView from './GridView'
import { loadDBCFile, DBCData } from '@/components/DBCParser/DBCParser';
// import {Card} from "@/components/ui/card";

// import { ChevronDown } from 'lucide-react';

// import GridControl from "@/components/LiveView/GridControl";
// import DBCControl from "@/components/LiveView/DBCControl";

export default function LiveView() {
    const [dbcData, setDbcData] = useState<DBCData | null>(null);
    const [isWSConnected, setIsWSConnected] = useState(false);
    const [shouldWSReconnect, setShouldWSReconnect] = useState(false);
    const [shouldClearMessages, setShouldClearMessages] = useState(false);
    const [wantLiveUpdate, setWantLiveUpdate] = useState(true);

    useEffect(() => {
        const fetchDBC = async () => {
            try {
                // HARDCODED!
                // const data = await loadDBCFile('/api/dbc/input.dbc');
                const data = await loadDBCFile('/api/dbc/CAN3_UASA2310_Vehicle_mitnode.dbc');
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

    /*
    <Sidebar className="w-100 border-r bg-gray-50 p-4">
                <Collapsible defaultOpen className="group/collapsible">
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger>
                                Help
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <Card className="mb-4 p-4">
                                    <GridControl isWSConnected={isWSConnected}
                                                 setShouldWSReconnect={setShouldWSReconnect}
                                                 wantLiveUpdate={wantLiveUpdate}
                                                 setWantLiveUpdate={setWantLiveUpdate}
                                                 setShouldClearMessages={setShouldClearMessages}/>
                                </Card>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>

                <Collapsible defaultOpen className="group/collapsible">
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger>
                                Help
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <Card className="mb-4 p-4">
                                    <DBCControl dbcData={dbcData}/>
                                </Card>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
            </Sidebar>
     */

    return (
        <div className="flex h-[calc(100vh-64px)]">
            <Sidebar isWSConnected={isWSConnected}
                     setShouldWSReconnect={setShouldWSReconnect}
                     wantLiveUpdate={wantLiveUpdate}
                     setWantLiveUpdate={setWantLiveUpdate}
                     setShouldClearMessages={setShouldClearMessages}
                     dbcData={dbcData}>
            </Sidebar>
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