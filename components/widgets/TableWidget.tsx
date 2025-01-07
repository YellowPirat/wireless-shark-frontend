import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

import { EnhancedCanMessage } from '@/components/CANParser/CANParser';

interface TableWidgetProps {
    messages: EnhancedCanMessage[];
}

export default function TableWidget({ messages }: TableWidgetProps) {
    return (
        <ScrollArea className="no-drag h-[93%] w-full rounded-md border p-1">
        <Table>
            <TableHeader className="sticky">
                <TableRow>
                    <TableHead className="">CAN ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Payload</TableHead>
                    <TableHead>Interpretiert</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {messages.map((message, i) => {
                    return (
                        <TableRow key={i}>
                            <TableCell className="font-medium">
                                {message.id.toString(16).padStart(3, '0').toUpperCase()}
                            </TableCell>
                            <TableCell>{message.timestamp.toString()}</TableCell>
                            <TableCell>
                                {Array.from(message.data.slice(0, message.length))
                                    .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
                                    .join(' ')}
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    {message.signals ?
                                        message.signals.map((signal, index) => {
                                        return (
                                            <div key={index} className="text-sm">
                                                <span className="font-medium">{signal.name}:</span>{' '}
                                                {signal.value.toFixed(0)} {signal.unit}
                                            </div>
                                        );
                                        })
                                        : <span className="text-gray-500">Keine DBC-Daten verfügbar</span>}
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
        </ScrollArea>
    )
}