// Types für die DBC-Struktur
interface Signal {
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
}

interface Message {
    id: number;
    name: string;
    length: number;
    sender: string;
    signals: Signal[];
}

interface DBCData {
    version: string;
    messages: Message[];
    nodes: string[];
}

// DBC Parser Klasse
class DBCParser {
    private data: DBCData = {
        version: "",
        messages: [],
        nodes: [],
    };

    // Hauptparse-Methode
    public parse(content: string): DBCData {
        const lines = content.split('\n');

        for (const line of lines) {
            if (line.startsWith('VERSION')) {
                this.parseVersion(line);
            } else if (line.startsWith('BU_')) {
                this.parseNodes(line);
            } else if (line.startsWith('BO_')) {
                this.parseMessage(line);
            } else if (line.trim().startsWith('SG_')) {
                this.parseSignal(line);
            }
        }

        return this.data;
    }

    private parseVersion(line: string): void {
        const match = line.match(/VERSION "(.*)"/);
        if (match) {
            this.data.version = match[1];
        }
    }

    private parseNodes(line: string): void {
        const nodes = line.substring(4).trim().split(' ');
        this.data.nodes = nodes.filter(node => node !== '');
    }

    private parseMessage(line: string): void {
        const match = line.match(/BO_ (\d+) (\w+): (\d+) (\w+)/);
        if (match) {
            const message: Message = {
                id: parseInt(match[1]),
                name: match[2],
                length: parseInt(match[3]),
                sender: match[4],
                signals: []
            };
            this.data.messages.push(message);
        }
    }

    private parseSignal(line: string): void {
        const match = line.match(/SG_ (\w+) : (\d+)\|(\d+)@(\d+)([-+]) \(([^,]+),([^)]+)\) \[([^|]+)\|([^\]]+)\] "([^"]*)" (\w+)/);
        if (match && this.data.messages.length > 0) {
            const signal: Signal = {
                name: match[1],
                startBit: parseInt(match[2]),
                length: parseInt(match[3]),
                byteOrder: parseInt(match[4]),
                factor: parseFloat(match[6]),
                offset: parseFloat(match[7]),
                minimum: parseFloat(match[8]),
                maximum: parseFloat(match[9]),
                unit: match[10],
                receiver: match[11]
            };
            this.data.messages[this.data.messages.length - 1].signals.push(signal);
        }
    }
}

// Hilfs-Funktion zum Laden der DBC-Datei
async function loadDBCFile(url: string): Promise<DBCData> {
    const response = await fetch(url);
    const content = await response.text();
    const parser = new DBCParser();
    return parser.parse(content);
}

export { DBCParser, loadDBCFile };
export type { DBCData, Message, Signal };