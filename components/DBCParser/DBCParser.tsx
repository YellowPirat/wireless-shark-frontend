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
    isSigned: boolean;
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
        // Erste Aufteilung bei den Hauptkomponenten
        const mainParts = line.trim().split(/\s*:\s*/);
        if (mainParts.length !== 2) return;

        // Parse Signal Name
        const nameMatch = mainParts[0].match(/SG_\s+([\w\s]+)/);
        if (!nameMatch) return;
        const name = nameMatch[1].trim();

        // Parse die technischen Details
        const detailsMatch = mainParts[1].match(/(\d+)\|(\d+)@(\d+)([-+])\s*\(([^,]+),([^)]+)\)\s*\[([^|]+)\|([^\]]+)\]\s*"([^"]*)"\s*([\w\s_]+)/);
        if (!detailsMatch) return;

        const factorStr = detailsMatch[5].toLowerCase(); // Konvertiere zu lowercase um sowohl 'e' als auch 'E' zu unterstützen
        const factor = factorStr.includes('e') ? parseFloat(factorStr) : parseFloat(detailsMatch[5]);

        const signal: Signal = {
            name,
            startBit: parseInt(detailsMatch[1]),
            length: parseInt(detailsMatch[2]),
            byteOrder: parseInt(detailsMatch[3]),
            isSigned: detailsMatch[4] === '-',
            factor: factor,
            offset: parseFloat(detailsMatch[6]),
            minimum: parseFloat(detailsMatch[7]),
            maximum: parseFloat(detailsMatch[8]),
            unit: detailsMatch[9],
            receiver: detailsMatch[10].trim()
        };

        if (this.data.messages.length > 0) {
            this.data.messages[this.data.messages.length - 1].signals.push(signal);
            //console.log(signal);
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