import { InterpretedSignal } from "@/components/CANParser/CANParser";

interface NumberWidgetProps {
    signal: InterpretedSignal | undefined;
    timestamp: string | Date | undefined;
}

export default function NumberWidget({signal, timestamp}: NumberWidgetProps) {
    // className={signal.value >= signal.minimum && signal.value <= signal.maximum ? 'bg-green-50' : 'bg-red-50'}
    const name = signal?.name ?? "not yet received";
    const value = signal?.value ?? 0;
    const minimum = signal?.minimum ?? 0;
    const maximum = signal?.maximum ?? 0;
    const unit = signal?.unit ?? "";
    const lasttimestamp = new Date(timestamp ?? Date.now());

    return (
        <div className={value >= minimum && value <= maximum ? 'bg-green-100 pl-2' : 'bg-red-100 pl-2'}>
            <div className="font-bold">
                {name}
            </div>
            <div className="text-2xl font-mono">
                {value.toFixed(0)}{unit}
            </div>
            <div className="text-sm text-gray-500">
                Range: [{minimum} to {maximum}]{unit}
            </div>
            <div className="text-xs text-gray-400">
                Last update: {lasttimestamp.toLocaleTimeString()}
            </div>
        </div>
    );
}