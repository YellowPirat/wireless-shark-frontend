import ConnectionStatusIndicator from "@/components/custom-ui/connectionStatusIndicator";
import DBCControl from './DBCControl'
import GridControl from './GridControl'

import {Card} from '@/components/ui/card'
import {DBCData} from "@/components/DBCParser/DBCParser";

interface SidebarProps {
    isWSConnected: boolean;
    dbcData: DBCData | null;
}

export default function Sidebar({isWSConnected, dbcData}: SidebarProps) {
    return (
        <div className="w-100 border-r bg-gray-50 p-4">
            <Card className="mb-4 p-4">
                <ConnectionStatusIndicator isConnected={isWSConnected}/>
            </Card>
            <Card className="mb-4 p-4">
                <DBCControl dbcData={dbcData}/>
            </Card>
            <Card className="mb-4 p-4">
                <GridControl/>
            </Card>
        </div>
    )
}