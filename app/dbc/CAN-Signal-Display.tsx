import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { type Signal, type Message } from './dbc-parser';

interface CANMessage {
    id: number;
    data: number[];  // Array of bytes
    timestamp: number;
}

interface Props {
    canMessages: CANMessage[];
    dbcMessage: Message;
}

const CANSignalDisplay: React.FC<Props> = ({ canMessages, dbcMessage }) => {

    if (!dbcMessage) {
        return (<div>leer</div>);
    }
    // Finde die letzte Nachricht mit der entsprechenden ID
    const lastMessage = useMemo(() => {
        const relevantMessages = canMessages.filter(msg => msg.id === dbcMessage.id);
        if (relevantMessages.length === 0) return null;

        // Finde die Nachricht mit dem höchsten Timestamp
        return relevantMessages.reduce((latest, current) => {
            return latest.timestamp > current.timestamp ? latest : current;
        });
    }, [canMessages, dbcMessage.id]);

    // Funktion zum Dekodieren eines Signals aus den Bytes
    const decodeSignal = (data: number[], signal: Signal): number => {
        // Konvertiere das Byte-Array in einen einzelnen Binärstring
        const bits = data.map(byte =>
            byte.toString(2).padStart(8, '0')
        ).join('');

        // Extrahiere die relevanten Bits basierend auf Startbit und Länge
        const startBit = signal.startBit;
        const length = signal.length;
        const relevantBits = bits.slice(startBit, startBit + length);

        // Konvertiere die Bits zurück in eine Dezimalzahl
        const value = parseInt(relevantBits, 2);

        // Wende Skalierungsfaktor und Offset an
        return value * signal.factor + signal.offset;
    };

    if (!lastMessage) {
        return (
            <div className="grid grid-cols-2 gap-4">
                {dbcMessage.signals.map((signal) => (
                    <Card key={signal.name} className="bg-gray-100">
                        <CardContent className="p-4">
                            <div className="text-lg font-bold">{signal.name}</div>
                            <div className="text-gray-500">Keine Daten verfügbar</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            {dbcMessage.signals.map((signal) => {
                // console.log(lastMessage.data);
                // console.log(signal);
                const value = decodeSignal(lastMessage.data, signal);
                // console.log(value);
                const isInRange = value >= signal.minimum && value <= signal.maximum;

                return (
                    <Card
                        key={signal.name}
                        className={`${isInRange ? 'bg-green-50' : 'bg-red-50'}`}
                    >
                        <CardContent className="p-4">
                            <div className="text-lg font-bold">{signal.name}</div>
                            <div className="text-2xl font-mono">
                                {value.toFixed(2)} {signal.unit}
                            </div>
                            <div className="text-sm text-gray-500">
                                Bereich: [{signal.minimum} bis {signal.maximum}] {signal.unit}
                            </div>
                            <div className="text-xs text-gray-400">
                                Letzte Aktualisierung: {new Date(lastMessage.timestamp).toLocaleTimeString()}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default CANSignalDisplay;