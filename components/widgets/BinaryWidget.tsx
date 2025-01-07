import { InterpretedSignal } from "@/components/CANParser/CANParser";

interface BinaryWidgetProps {
    signal: InterpretedSignal | undefined;
    timestamp: string | Date | undefined;
}

const toBinary = (num: number): string => {
    // Konvertiere zu Binär und füge führende Nullen hinzu für 8 Bit
    return "0b" + Math.round(num).toString(2).padStart(8, '0');
};

const formatBinary = (binary: string): string => {
    // Gruppiere Bits in 4er-Gruppen für bessere Lesbarkeit
    const withoutPrefix = binary.replace('0b', '');
    const groups = withoutPrefix.match(/.{1,4}/g) || [];
    return '0b' + groups.join(' ');
};

export default function BinaryWidget({signal, timestamp}: BinaryWidgetProps) {
    const name = signal?.name ?? "not yet received";
    const value = signal?.value ?? 0;
    const minimum = signal?.minimum ?? 0;
    const maximum = signal?.maximum ?? 0;
    const unit = signal?.unit ?? "";
    const lasttimestamp = new Date(timestamp ?? Date.now());

    // Konvertiere die Werte in Binär
    const binaryValue = formatBinary(toBinary(value));
    const binaryMin = formatBinary(toBinary(minimum));
    const binaryMax = formatBinary(toBinary(maximum));

    return (
        <div className={value >= minimum && value <= maximum ? 'bg-green-100 pl-2 no-drag' : 'bg-red-100 pl-2 no-drag'}>
            <div className="font-bold">
                {name}
            </div>
            <div className="text-xl font-mono">
                {binaryValue}{unit}
            </div>
            <div className="text-sm text-gray-500">
                Range: [{binaryMin} to {binaryMax}]{unit}
            </div>
            <div className="text-xs text-gray-400">
                Last update: {lasttimestamp.toLocaleTimeString()}
            </div>
        </div>
    );
}