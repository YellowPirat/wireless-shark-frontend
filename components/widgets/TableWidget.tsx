import { EnhancedCanMessage } from '@/components/CANParser/CANParser';
import { memo, useMemo, useRef, useEffect, useState } from 'react';
import { VariableSizeList, ListChildComponentProps, ListOnScrollProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface TableWidgetProps {
    messages: EnhancedCanMessage[];
}

interface RowData {
    messages: EnhancedCanMessage[];
}

interface RowProps extends ListChildComponentProps<RowData> {
    data: RowData;
    index: number;
    style: React.CSSProperties;
}

const BASE_ROW_HEIGHT = 40;
const SIGNAL_HEIGHT = 24;

const getRowHeight = (message: EnhancedCanMessage) => {
    if (!message.signals || message.signals.length === 0) {
        return BASE_ROW_HEIGHT;
    }
    return Math.max(BASE_ROW_HEIGHT, SIGNAL_HEIGHT * message.signals.length) + 12;
};

const formatTimestamp = (timestamp: string | Date | number): string => {
    // Konvertiere den Timestamp in ein Date-Objekt
    const date = typeof timestamp === 'string' ? new Date(timestamp) :
        timestamp instanceof Date ? timestamp :
            new Date(timestamp);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const Row = memo(({ data, index, style }: RowProps) => {
    const message = data.messages[index];

    const payload = useMemo(() =>
            Array.from(message.data.slice(0, message.length))
                .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
                .join(' '),
        [message.data, message.length]
    );

    const formattedTime = useMemo(() =>
            formatTimestamp(message.timestamp),
        [message.timestamp]
    );

    return (
        <div style={style} className="flex border-b">
            <div className="w-24 p-2 font-medium">
                {message.id.toString(16).padStart(3, '0').toUpperCase()}
            </div>
            <div className="w-32 p-2">
                {formattedTime}
            </div>
            <div className="w-48 p-2">
                {payload}
            </div>
            <div className="flex-1 p-2">
                <div className="space-y-1 pb-4">
                    {message.signals ?
                        message.signals.map((signal, index) => (
                            <div key={index} className="text-sm">
                                <span className="font-medium">{signal.name}:</span>{' '}
                                {signal.value.toFixed(2)} {signal.unit}
                            </div>
                        ))
                        : <span className="text-gray-500">No DBC-Data available</span>}
                </div>
            </div>
        </div>
    );
});

Row.displayName = 'Row';

const TableHeader = memo(() => (
    <div className="flex border-b sticky top-0 bg-white z-10">
        <div className="w-24 p-2 font-medium text-muted-foreground">CAN ID</div>
        <div className="w-32 p-2 font-medium text-muted-foreground">Timestamp</div>
        <div className="w-48 p-2 font-medium text-muted-foreground">Payload</div>
        <div className="flex-1 p-2 font-medium text-muted-foreground">Interpreted</div>
    </div>
));

TableHeader.displayName = 'TableHeader';

const TableWidget = memo(({ messages }: TableWidgetProps) => {
    const listRef = useRef<VariableSizeList>(null);
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

    const displayMessages = useMemo(() =>
            messages.slice(-1000),
        [messages]
    );

    const getItemSize = (index: number) => {
        return getRowHeight(displayMessages[index]);
    };

    // Reset cache wenn sich die Nachrichten ändern
    useMemo(() => {
        if (listRef.current) {
            listRef.current.resetAfterIndex(0);
        }
    }, [displayMessages]);

    // Scrolle nach unten wenn neue Nachrichten ankommen
    useEffect(() => {
        if (!isUserScrolling && listRef.current && displayMessages.length > 0) {
            listRef.current.scrollToItem(displayMessages.length - 1, "end");
        }
    }, [displayMessages, isUserScrolling]);

    // Handle user scroll
    const handleScroll = ({ scrollUpdateWasRequested }: ListOnScrollProps) => {
        // Wenn der Scroll nicht von unserem Code ausgelöst wurde
        if (!scrollUpdateWasRequested) {
            setIsUserScrolling(true);

            // Clear existing timeout
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            // Set new timeout
            const timeout = setTimeout(() => {
                setIsUserScrolling(false);
            }, 1000); // Resume auto-scroll after 1 second of no user scrolling

            setScrollTimeout(timeout);
        }
    };

    // Cleanup timeout
    useEffect(() => {
        return () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
        };
    }, [scrollTimeout]);

    return (
        <div className="no-drag h-[93%] w-full rounded-md border p-1">
            <TableHeader />
            <div className="h-[calc(100%-2.5rem)]">
                <AutoSizer>
                    {({ height, width }) => (
                        <VariableSizeList
                            ref={listRef}
                            height={height}
                            width={width}
                            itemCount={displayMessages.length}
                            itemSize={getItemSize}
                            itemData={{
                                messages: displayMessages
                            }}
                            onScroll={handleScroll}
                        >
                            {Row}
                        </VariableSizeList>
                    )}
                </AutoSizer>
            </div>
        </div>
    );
});

TableWidget.displayName = 'TableWidget';

export default TableWidget;