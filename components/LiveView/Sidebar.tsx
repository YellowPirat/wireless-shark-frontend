import ConnectionStatusIndicator from "@/components/custom-ui/connectionStatusIndicator";
import LiveControl from "@/components/custom-ui/liveControl";
import DBCControl from './DBCControl'
import GridControl from './GridControl'

import { Card } from '@/components/ui/card'
import { Separator } from "@/components/ui/separator";

import { DBCData } from "@/components/DBCParser/DBCParser";


interface SidebarProps {
    isWSConnected: boolean;
    dbcData: DBCData | null;
}

export default function Sidebar({isWSConnected, dbcData}: SidebarProps) {
    return (
        <div className="w-100 border-r bg-gray-50 p-4">
            <Card className="mb-4 p-4">
                <ConnectionStatusIndicator isConnected={isWSConnected}/>
                <Separator/>
                <LiveControl/>
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