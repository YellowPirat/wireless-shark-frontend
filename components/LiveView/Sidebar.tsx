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
    setShouldRemoveAllWidgets: (value: boolean) => void;
    setShouldSaveAllWidgets: (value: boolean) => void;
    setShouldLoadAllWidgets: (value: boolean) => void;
}

export default function ownSidebar({
                                       isWSConnected,
                                       setShouldWSReconnect,
                                       wantLiveUpdate,
                                       setWantLiveUpdate,
                                       setShouldClearMessages,
                                       onAddWidget,
                                       dbcData,
                                       setShouldRemoveAllWidgets,
                                       setShouldSaveAllWidgets,
                                       setShouldLoadAllWidgets
                                   }: SidebarProps) {
    return (
        <div className="w-[310px] border-r bg-gray-50 p-4 flex flex-col">
            <Card className="shrink-0 mb-4 p-4">
                <GridControl
                    isWSConnected={isWSConnected}
                    setShouldWSReconnect={setShouldWSReconnect}
                    wantLiveUpdate={wantLiveUpdate}
                    setWantLiveUpdate={setWantLiveUpdate}
                    setShouldClearMessages={setShouldClearMessages}
                    setShouldRemoveAllWidgets={setShouldRemoveAllWidgets}
                    setShouldSaveAllWidgets={setShouldSaveAllWidgets}
                    setShouldLoadAllWidgets={setShouldLoadAllWidgets}
                />
            </Card>
            <Card className="flex-1 min-h-0 mb-4 p-4">
                <DBCControl
                    onAddWidget={onAddWidget}
                    dbcData={dbcData}
                />
            </Card>
            <div className="shrink-0 text-center text-sm text-gray-500">
                created by TI 5 in WiSe 2024/25
            </div>
        </div>
    )
}