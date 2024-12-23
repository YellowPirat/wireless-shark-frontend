import { InterpretedSignal } from "@/components/CANParser/CANParser";

interface HexWidgetProps {
    signal: InterpretedSignal | undefined;
    timestamp: string | Date | undefined;
}

const toHex = (num: number): string => {
    // Konvertiere zu HEX und entferne das '0x' Prefix
    return "0x" + Math.round(num).toString(16).toUpperCase().padStart(2, '0');
};

export default function HexWidget({signal, timestamp}: HexWidgetProps) {
    const name = signal?.name ?? "not yet received";
    const value = signal?.value ?? 0;
    const minimum = signal?.minimum ?? 0;
    const maximum = signal?.maximum ?? 0;
    const unit = signal?.unit ?? "";
    const lasttimestamp = new Date(timestamp ?? Date.now());

    // Konvertiere die Werte in HEX
    const hexValue = toHex(value);
    const hexMin = toHex(minimum);
    const hexMax = toHex(maximum);

    return (
        <div className={value >= minimum && value <= maximum ? 'bg-green-100 pl-2 no-drag' : 'bg-red-100 pl-2 no-drag'}>
            <div className="font-bold">
                {name}
            </div>
            <div className="text-2xl font-mono">
                {hexValue}{unit}
            </div>
            <div className="text-sm text-gray-500">
                Range: [{hexMin} to {hexMax}]{unit}
            </div>
            <div className="text-xs text-gray-400">
                Last update: {lasttimestamp.toLocaleTimeString()}
            </div>
        </div>
    );
}