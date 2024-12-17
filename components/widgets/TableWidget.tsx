import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {DBCData} from "@/components/DBCParser/DBCParser";

interface CanMessage {
    id: number; // Die ID wird als Hex-String dargestellt
    timestamp: string | Date; // Zeitstempel der Nachricht
    data: Uint8Array | number[]; // Rohdaten als Uint8Array oder ähnliches typisiertes Array
    length: number; // Länge der Nachricht
}

interface TableWidgetProps {
    messages: CanMessage[];
    dbcData: DBCData | null;
}

export default function TableWidget({ messages, dbcData }: TableWidgetProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="">CAN ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Payload</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {messages.map((message, i) => (
                    <TableRow key={i}>
                        <TableCell className="font-medium">{message.id.toString(16).padStart(3, '0').toUpperCase()}</TableCell>
                        <TableCell>{message.timestamp.toString()}</TableCell>
                        <TableCell>

                            {Array.from(message.data.slice(0, message.length))
                                .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
                                .join(' ')}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}