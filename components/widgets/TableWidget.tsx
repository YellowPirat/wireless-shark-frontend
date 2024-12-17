import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {DBCData, Signal} from "@/components/DBCParser/DBCParser";

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

// Funktion zum Extrahieren eines Signals aus den Rohdaten
function extractSignal(data: Uint8Array | number[], signal: Signal): number {
    let result = 0n;
    const dataView = new DataView(new Uint8Array(data).buffer);

    // Bit-Extraktion basierend auf Intel (1) oder Motorola (0) Byte-Reihenfolge
    if (signal.byteOrder === 1) { // Intel (LSB)
        const startByte = Math.floor(signal.startBit / 8);
        const bitOffset = signal.startBit % 8;

        for (let i = 0; i < signal.length; i++) {
            const currentByte = Math.floor((signal.startBit + i) / 8);
            const currentBit = (signal.startBit + i) % 8;

            if (currentByte < data.length) {
                const bit = (data[currentByte] >> currentBit) & 1;
                if (bit) {
                    result |= 1n << BigInt(i);
                }
            }
        }
    } else { // Motorola (MSB)
        const startByte = Math.floor(signal.startBit / 8);
        const bitOffset = 7 - (signal.startBit % 8);

        for (let i = 0; i < signal.length; i++) {
            const currentByte = startByte - Math.floor((bitOffset + i) / 8);
            const currentBit = 7 - ((bitOffset + i) % 8);

            if (currentByte >= 0 && currentByte < data.length) {
                const bit = (data[currentByte] >> currentBit) & 1;
                if (bit) {
                    result |= 1n << BigInt(signal.length - 1 - i);
                }
            }
        }
    }

    // Anwendung von Faktor und Offset
    const rawValue = Number(result);
    return rawValue * signal.factor + signal.offset;
}

// Komponente zum Anzeigen der interpretierten Signale
function InterpretedSignals({ message, dbcMessage }: {
    message: CanMessage,
    dbcMessage: { signals: Signal[] } | undefined
}) {
    if (!dbcMessage) {
        return <span className="text-gray-500">Keine DBC-Daten verfügbar</span>;
    }

    return (
        <div className="space-y-1">
            {dbcMessage.signals.map((signal, index) => {
                const value = extractSignal(message.data, signal);
                return (
                    <div key={index} className="text-sm">
                        <span className="font-medium">{signal.name}:</span>{' '}
                        {value.toFixed(0)} {signal.unit}
                    </div>
                );
            })}
        </div>
    );
}

export default function TableWidget({ messages, dbcData }: TableWidgetProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="">CAN ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Payload</TableHead>
                    <TableHead>Interpretiert</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {messages.map((message, i) => {
                    // Debug-Informationen für jede Nachricht
                    console.log("Current message:", {
                        id: message.id,
                        idType: typeof message.id,
                        hexId: message.id.toString(16)
                    });

                    const dbcMessage = dbcData?.messages.find(m => {
                        // Vergleich mit zusätzlicher Debug-Ausgabe
                        console.log(`Comparing message ID ${message.id} (${typeof message.id}) with DBC ID ${m.id} (${typeof m.id})`);
                        return m.id === message.id;
                    });

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
                                <InterpretedSignals
                                    message={message}
                                    dbcMessage={dbcMessage}
                                />
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    )
}