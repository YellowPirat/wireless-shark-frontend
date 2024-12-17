
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
    dbcData: DBCData | null;
}

export default function Sidebar({isWSConnected, setShouldWSReconnect, wantLiveUpdate, setWantLiveUpdate, setShouldClearMessages, dbcData}: SidebarProps) {
    return (
        <div className="w-100 border-r bg-gray-50 p-4">
            <Card className="mb-4 p-4">
                <GridControl isWSConnected={isWSConnected}
                             setShouldWSReconnect={setShouldWSReconnect}
                             wantLiveUpdate={wantLiveUpdate}
                             setWantLiveUpdate={setWantLiveUpdate}
                             setShouldClearMessages={setShouldClearMessages}/>
            </Card>
            <Card className="mb-4 p-4">
                <DBCControl dbcData={dbcData}/>
            </Card>
        </div>
    )
}