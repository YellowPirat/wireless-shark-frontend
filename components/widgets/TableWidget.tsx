import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface CanMessage {
    id: number;
    timestamp: string | Date;
    data: Uint8Array | number[];
    length: number;
}

export default function TableWidget({ messages }: { messages: CanMessage[] }) {
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