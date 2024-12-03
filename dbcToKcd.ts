// dbcToKcd.ts
import { promises as fs } from 'fs';

export interface DbcMessage {
    id: string;
    name: string;
    dlc: number;
    signals: DbcSignal[];
}

export interface DbcSignal {
    name: string;
    startBit: number;
    length: number;
    byteOrder: 'big' | 'little';
    signed: boolean;
    factor: number;
    min: number;
    max: number;
    unit: string;
}

export interface ConversionOptions {
    inputPath?: string;
    outputPath?: string;
    dbcContent?: string;
}

export class DbcToKcdConverter {
    private messages: DbcMessage[] = [];

    constructor(private options: ConversionOptions = {}) {}

    public async convertFile(inputPath: string, outputPath: string): Promise<void> {
        const dbcContent = await fs.readFile(inputPath, 'utf-8');
        const kcdContent = await this.convertContent(dbcContent);
        await fs.writeFile(outputPath, kcdContent);
    }

    public async convertContent(dbcContent: string): Promise<string> {
        try {
            this.parseDbc(dbcContent);
            return this.generateKcd();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Conversion failed: ${error.message}`);
            } else  {
                throw new Error(`Conversion failed`);
            }
        }
    }

    private parseDbc(content: string): void {
        this.messages = [];
        const lines = content.split('\n');
        let currentMessage: DbcMessage | null = null;

        for (const line of lines) {
            if (line.startsWith('BO_')) {
                currentMessage = this.parseMessageDefinition(line);
                this.messages.push(currentMessage);
            } else if (line.startsWith(' SG_') && currentMessage) {
                const signal = this.parseSignalDefinition(line);
                currentMessage.signals.push(signal);
            }
        }
    }

    private parseMessageDefinition(line: string): DbcMessage {
        const match = line.match(/BO_ (\d+) (\w+): (\d+)/);
        if (!match) throw new Error(`Invalid message definition: ${line}`);

        return {
            id: match[1],
            name: match[2],
            dlc: parseInt(match[3], 10),
            signals: []
        };
    }

    private parseSignalDefinition(line: string): DbcSignal {
        const match = line.match(
            /SG_ (\w+) : (\d+)\|(\d+)@([01])([+-]) \(([\d.]+),([\d.]+)\) \[([\d.-]+)\|([\d.-]+)\] "([^"]*)"/
        );
        if (!match) throw new Error(`Invalid signal definition: ${line}`);

        return {
            name: match[1],
            startBit: parseInt(match[2], 10),
            length: parseInt(match[3], 10),
            byteOrder: match[4] === '0' ? 'big' : 'little',
            signed: match[5] === '-',
            factor: parseFloat(match[6]),
            min: parseFloat(match[8]),
            max: parseFloat(match[9]),
            unit: match[10]
        };
    }

    private generateKcd(): string {
        let kcdContent = `<?xml version="1.0" encoding="UTF-8"?>
<NetworkDefinition xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Bus name="CAN">
    <Document name="Converted DBC File" version="1.0" />
`;

        for (const msg of this.messages) {
            kcdContent += this.generateMessageXml(msg);
        }

        kcdContent += '  </Bus>\n</NetworkDefinition>';
        return kcdContent;
    }

    private generateMessageXml(msg: DbcMessage): string {
        let messageXml = `    <Message id="${msg.id}" name="${msg.name}" length="${msg.dlc}">\n`;

        for (const signal of msg.signals) {
            messageXml += `      <Signal name="${signal.name}" offset="${signal.startBit}"
        length="${signal.length}"
        endian="${signal.byteOrder === 'big' ? '1' : '0'}"
        signed="${signal.signed}"
        factor="${signal.factor}"
        min="${signal.min}"
        max="${signal.max}"
        unit="${signal.unit}" />\n`;
        }

        messageXml += '    </Message>\n';
        return messageXml;
    }
}