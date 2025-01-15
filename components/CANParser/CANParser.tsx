// DBC Interfaces
export interface Signal {
    name: string;
    startBit: number;
    length: number;
    byteOrder: number;
    factor: number;
    offset: number;
    minimum: number;
    maximum: number;
    unit: string;
    receiver: string;
    isSigned: boolean;
}

export interface Message {
    id: number;
    name: string;
    length: number;
    sender: string;
    signals: Signal[];
}

export interface DBCData {
    version: string;
    messages: Message[];
    nodes: string[];
}

// CAN Message Interfaces
export interface CanMessage {
    id: number;
    timestamp: string | Date;
    data: Uint8Array | number[];
    length: number;
}

export interface InterpretedSignal {
    name: string;
    value: number;
    minimum: number;
    maximum: number;
    unit: string;
}

export interface EnhancedCanMessage extends CanMessage {
    signals: InterpretedSignal[];
}

export class CANParser {
    private dbcData: DBCData;

    constructor(dbcData: DBCData) {
        this.dbcData = dbcData;
    }

    private extractSignalIntel(data: Uint8Array | number[], signal: Signal): number {
        const startByte = Math.floor(signal.startBit / 8);
        const bitOffset = signal.startBit % 8;

        // Für 32-Bit Signale
        if (signal.length === 32 && bitOffset === 0) {
            let value = 0;
            // Bytes in der richtigen Reihenfolge lesen (Little Endian: DCBA)
            if (startByte + 3 < data.length) {
                value = (data[startByte + 3] << 24) |
                    (data[startByte + 2] << 16) |
                    (data[startByte + 1] << 8) |
                    data[startByte];
            }

            // Vorzeichenbehandlung für 32-Bit
            if (signal.isSigned && (value & 0x80000000)) {
                value = value | 0; // Konvertiert zu signed 32-bit integer
            }
            return value;
        }

        // Für andere Signale
        let result = 0;
        for (let i = 0; i < signal.length; i++) {
            const currentByte = Math.floor((signal.startBit + i) / 8);
            const currentBit = (signal.startBit + i) % 8;

            if (currentByte < data.length) {
                const bit = (data[currentByte] >> currentBit) & 1;
                if (bit === 1) {
                    result |= (1 << i);
                }
            }
        }

        // Vorzeichenbehandlung für andere Längen
        if (signal.isSigned && (result & (1 << (signal.length - 1)))) {
            result = result - (1 << signal.length);
        }

        return result;
    }

    private extractSignalMotorola(data: Uint8Array | number[], signal: Signal): number {
        const startByte = Math.floor(signal.startBit / 8);
        const bitOffset = 7 - (signal.startBit % 8);

        // Für 32-Bit Signale
        if (signal.length === 32 && bitOffset === 7) {
            let value = 0;
            // Bei Motorola werden die Bytes in Big-Endian Reihenfolge gelesen (ABCD)
            if (startByte >= 3) {
                value = (data[startByte - 3] << 24) |
                    (data[startByte - 2] << 16) |
                    (data[startByte - 1] << 8) |
                    data[startByte];
            }

            // Vorzeichenbehandlung für 32-Bit
            if (signal.isSigned && (value & 0x80000000)) {
                value = value | 0; // Konvertiert zu signed 32-bit integer
            }
            return value;
        }

        // Für andere Signallängen
        let result = 0;
        for (let i = 0; i < signal.length; i++) {
            const currentByte = startByte - Math.floor((bitOffset + i) / 8);
            const currentBit = 7 - ((bitOffset + i) % 8);

            if (currentByte >= 0 && currentByte < data.length) {
                const bit = (data[currentByte] >> currentBit) & 1;
                if (bit === 1) {
                    result |= (1 << (signal.length - 1 - i));
                }
            }
        }

        // Vorzeichenbehandlung für andere Längen
        if (signal.isSigned && (result & (1 << (signal.length - 1)))) {
            result = result - (1 << signal.length);
        }

        return result;
    }

    private extractSignal(data: Uint8Array | number[], signal: Signal): number {
        let rawValue: number;

        // Wähle die entsprechende Extraktionsmethode basierend auf der Byte-Reihenfolge
        if (signal.byteOrder === 1) { // Intel (LSB) Little Endian
            rawValue = this.extractSignalIntel(data, signal);
        } else { // Motorola (MSB) Big Endian
            rawValue = this.extractSignalMotorola(data, signal);
        }

        // Anwendung von Faktor und Offset
        const value = rawValue * signal.factor + signal.offset;

        // Wertebegrenzung, falls minimum und maximum definiert sind
        //if (typeof signal.minimum === 'number' && typeof signal.maximum === 'number') {
        //    return Math.min(Math.max(value, signal.minimum), signal.maximum);
        //}

        return value;
    }

    public interpretMessage(message: CanMessage): EnhancedCanMessage {
        const dbcMessage = this.dbcData.messages.find(m => Number(m.id) === Number(message.id));
        const interpretedSignals: InterpretedSignal[] = [];

        if (dbcMessage) {
            dbcMessage.signals.forEach(signal => {
                const value = this.extractSignal(message.data, signal);
                interpretedSignals.push({
                    name: signal.name,
                    value: value,
                    minimum: signal.minimum,
                    maximum: signal.maximum,
                    unit: signal.unit
                });
            });
        }

        return {
            ...message,
            signals: interpretedSignals
        };
    }

    public interpretMessages(messages: CanMessage[]): EnhancedCanMessage[] {
        return messages.map(message => this.interpretMessage(message));
    }

    // Hilfsmethode zum Formatieren einer CAN-ID als Hex-String
    public static formatCanId(id: number): string {
        return id.toString(16).padStart(3, '0').toUpperCase();
    }

    // Hilfsmethode zum Formatieren von CAN-Daten als Hex-String
    public static formatCanData(data: Uint8Array | number[], length: number): string {
        return Array.from(data.slice(0, length))
            .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
            .join(' ');
    }
}