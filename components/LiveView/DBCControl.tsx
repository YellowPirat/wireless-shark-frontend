import {DBCData} from "@/components/DBCParser/DBCParser";

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface DBCControlProps {
    dbcData: DBCData | null;
}

export default function DBCControl({ dbcData }: DBCControlProps) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">DBC Control</h3>
            {dbcData ? (
            <div className="space-y-4">
                <div className="text-sm text-gray-500">Version: {dbcData.version}</div>
                <ScrollArea className="h-[400px] w-[250px] rounded-md border p-4">
                    {dbcData.messages.map((message, index) => (
                        <div key={index}>
                            <span className="font-medium">{message.name}</span>
                            <span className="pl-2 text-sm text-gray-500">
                                            ID: {message.id}
                                        </span>
                            {message.signals.map((signal, sigIndex) => (
                                <div key={sigIndex} className="pl-2 rounded-md">
                                    <Separator className="my-1"/>
                                    <span className="font-medium">{signal.name}</span>
                                    <span className="pl-2 pr-8 text-sm text-gray-500">
                                                    Start: {signal.startBit}
                                                </span>
                                </div>
                            ))}
                            <Separator className="my-3"/>
                        </div>
                    ))}
                </ScrollArea>
            </div>) : (
                <div>Lade DBC Daten...</div>
            )}
        </div>
    )
}