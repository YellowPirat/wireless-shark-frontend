import {DBCData} from "@/components/DBCParser/DBCParser";
import {ScrollArea} from "@/components/ui/scroll-area"
import {Separator} from "@/components/ui/separator"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DBCControlProps {
    onAddWidget: (type: string, CANID: number, signalID: number) => void;
    dbcData: DBCData | null;
}

export default function DBCControl({dbcData, onAddWidget}: DBCControlProps) {
    return (
        <div className="h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-2">DBC Control</h3>
            {dbcData ? (
                <div className="flex flex-col min-h-0">
                    <div className="text-sm text-gray-500 mb-4">Version: {dbcData.version}</div>
                    <ScrollArea className="flex-1">
                        <div className="pr-4">
                            <div className="mt-2">
                                <span
                                    onClick={() => onAddWidget("Table", -1, -1)}
                                    className="font-medium hover:underline hover:cursor-pointer"
                                >
                                    All CAN messages
                                </span>
                                <Separator className="my-3"/>
                            </div>
                            {dbcData.messages.map((message, index) => (
                                <div key={index}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="flex items-center hover:cursor-pointer">
                                                <span className="font-medium hover:underline">
                                                    {message.name}
                                                </span>
                                                <span className="pl-2 text-sm text-gray-500">
                                                    ID: {message.id.toString(16).padStart(3, '0').toUpperCase()}
                                                </span>
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuLabel>Add Widget</DropdownMenuLabel>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem
                                                    onClick={() => onAddWidget("FilteredTable", message.id, -1)}
                                                >
                                                    Filtered Table
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onAddWidget("Signals", message.id, -1)}
                                                >
                                                    Signals
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    {message.signals.map((signal, sigIndex) => (
                                        <DropdownMenu key={sigIndex}>
                                            <DropdownMenuTrigger asChild>
                                                <div className="pl-2 rounded-md flex flex-col hover:cursor-pointer">
                                                    <Separator className="my-1"/>
                                                    <div className="flex items-center">
                                                        <span className="font-medium hover:underline">
                                                            {signal.name}
                                                        </span>
                                                        <span className="pl-2 pr-8 text-sm text-gray-500">
                                                            Start: {signal.startBit}
                                                        </span>
                                                    </div>
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                <DropdownMenuLabel>Add Widget</DropdownMenuLabel>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem
                                                        onClick={() => onAddWidget("Number", message.id, sigIndex)}
                                                    >
                                                        Number
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onAddWidget("Binary", message.id, sigIndex)}
                                                    >
                                                        Binary
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onAddWidget("Hex", message.id, sigIndex)}
                                                    >
                                                        Hex
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onAddWidget("Gauge", message.id, sigIndex)}
                                                    >
                                                        Gauge
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onAddWidget("LineChart", message.id, sigIndex)}
                                                    >
                                                        LineChart
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ))}
                                    <Separator className="my-3"/>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            ) : (
                <div>Lade DBC Daten...</div>
            )}
        </div>
    )
}