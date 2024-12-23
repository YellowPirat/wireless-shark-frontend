import React from 'react';
import { InterpretedSignal } from "@/components/CANParser/CANParser";

interface GaugeWidgetProps {
    signal: InterpretedSignal | undefined;
    timestamp: string | Date | undefined;
}

export default function GaugeWidget({signal, timestamp}: GaugeWidgetProps) {
    const name = signal?.name ?? "not yet received";
    const value = signal?.value ?? 0;
    const minimum = signal?.minimum ?? 0;
    const maximum = signal?.maximum ?? 0;
    const unit = signal?.unit ?? "";
    const lasttimestamp = new Date(timestamp ?? Date.now());

    // Calculate gauge parameters
    const radius = 80;
    const strokeWidth = 15;
    const normalizedValue = Math.max(minimum, Math.min(maximum, value));
    const percentage = ((normalizedValue - minimum) / (maximum - minimum)) * 100;

    // Calculate SVG arc parameters
    const circumference = radius * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = ((100 - percentage) / 100) * circumference;

    return (
        <div className={value >= minimum && value <= maximum ? 'bg-green-100 p-4 rounded-lg no-drag' : 'bg-red-100 p-4 rounded-lg no-drag'}>
            <div className="font-bold mb-2">
                {name}
            </div>

            <div className="relative w-48 h-24 mx-auto">
                {/* Background arc */}
                <svg className="transform w-48 h-24" viewBox="0 0 200 100">
                    <path
                        d="M20 100 A80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth={strokeWidth}
                        className="stroke-gray-200"
                    />
                    {/* Value arc */}
                    <path
                        d="M20 100 A80 80 0 0 1 180 100"
                        fill="none"
                        stroke={value >= minimum && value <= maximum ? '#34d399' : '#ef4444'}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-100"
                    />
                </svg>
                {/* Value display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-mono">
                        <br/>
                        {value.toFixed(0)}{unit}
                    </span>
                </div>
            </div>

            <div className="mt-2 flex justify-between text-sm text-gray-500">
                <span>{minimum}{unit}</span>
                <span>{maximum}{unit}</span>
            </div>

            <div className="text-xs text-gray-400 mt-2">
                Last update: {lasttimestamp.toLocaleTimeString()}
            </div>
        </div>
    );
}