'use client';

import { EnhancedCanMessage } from "@/components/CANParser/CANParser";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface LineChartWidgetProps {
    messages: EnhancedCanMessage[];
    signalID: number;
}

export default function LineChartWidget({messages, signalID}: LineChartWidgetProps) {
    // className={signal.value >= signal.minimum && signal.value <= signal.maximum ? 'bg-green-50' : 'bg-red-50'}
    /*
    const name = signal?.name ?? "not yet received";
    const value = signal?.value ?? 0;
    const minimum = signal?.minimum ?? 0;
    const maximum = signal?.maximum ?? 0;
    const unit = signal?.unit ?? "";
    const lasttimestamp = new Date(timestamp ?? Date.now());

*/

    const chartConfig = {
        signal: {
            label: "Data",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    const chartData = messages.map(msg => {
        const secondsAgo = Math.round((Date.now() - new Date(msg.timestamp).getTime()) / 1000);
        return {
            time: -secondsAgo, // Negative Werte für "vor X Sekunden"
            signal: msg.signals[signalID].value
        };
    });

    return (
        <ChartContainer config={chartConfig}>
            <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={true} />
                <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                    <linearGradient id="fillSignal" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="var(--color-signal)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--color-signal)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="signal"
                    type="natural"
                    fill="url(#fillSignal)"
                    fillOpacity={0.4}
                    stroke="var(--color-signal)"
                    stackId="a"
                    isAnimationActive={false}
                />
            </AreaChart>
        </ChartContainer>
    );
}