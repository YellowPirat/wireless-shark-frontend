
import DBCControl from './DBCControl'
import GridControl from './GridControl'

import { Card } from '@/components/ui/card'

import { DBCData } from "@/components/DBCParser/DBCParser";


interface SidebarProps {
    isWSConnected: boolean;
    setShouldWSReconnect: (value: boolean) => void;
    wantLiveUpdate: boolean;
    setWantLiveUpdate: (value: boolean) => void;
    setShouldClearMessages: (value: boolean) => void;
    onAddWidget: (type: string, CANID: number, signalID: number) => void;
    dbcData: DBCData | null;
}

export default function ownSidebar({isWSConnected, setShouldWSReconnect, wantLiveUpdate, setWantLiveUpdate, setShouldClearMessages, onAddWidget, dbcData}: SidebarProps) {
    return (
        <div className="w-100 border-r bg-gray-50 p-4 flex justify-end flex-col">
            <Card className="mb-4 p-4">
                <GridControl isWSConnected={isWSConnected}
                             setShouldWSReconnect={setShouldWSReconnect}
                             wantLiveUpdate={wantLiveUpdate}
                             setWantLiveUpdate={setWantLiveUpdate}
                             setShouldClearMessages={setShouldClearMessages}
                />
            </Card>
            <Card className="mb-4 p-4 max-h-full flex-grow-[4]">
                <DBCControl onAddWidget={onAddWidget}
                            dbcData={dbcData}
                />
            </Card>
            <div className="text-center">
                created by TI 5 in WiSe 2024/25
            </div>
        </div>
    )
}