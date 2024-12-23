'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {GridItemHTMLElement, GridStack as GridStackType} from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import TableWidget from "@/components/widgets/TableWidget";
import { Card } from "@/components/ui/card";

import { DBCData } from "@/components/DBCParser/DBCParser";
import { CANParser, EnhancedCanMessage } from '@/components/CANParser/CANParser';

import DeleteButton from "@/components/custom-ui/DeleteButton"
import NumberWidget from "@/components/widgets/NumberWidget";
import GaugeWidget from "@/components/widgets/GaugeWidget";
import HexWidget from "@/components/widgets/HexWidget";
import BinaryWidget from "@/components/widgets/BinaryWidget";

interface GridViewProps {
    isWSConnected: boolean;
    setIsWSConnected: (value: boolean) => void;
    shouldWSReconnect: boolean;
    setShouldWSReconnect: (value: boolean) => void;
    wantLiveUpdate: boolean;
    shouldClearMessages: boolean;
    setShouldClearMessages: (value: boolean) => void;
    widgetToAdd: {type: string, CANID: number, signalID: number} | null;
    setWidgetToAdd: (widget: {type: string, CANID: number, signalID: number} | null) => void;
    dbcData: DBCData | null;
}

interface Widgets {
    widgetID: number;
    widgetType: string;
    CANID: number;
    signalID: number;
}

export default function GridStackComponent({
                                               isWSConnected,
                                               setIsWSConnected,
                                               shouldWSReconnect,
                                               setShouldWSReconnect,
                                               wantLiveUpdate,
                                               shouldClearMessages,
                                               setShouldClearMessages,
                                               widgetToAdd,
                                               setWidgetToAdd,
                                               dbcData
                                           }: GridViewProps) {
    const wsRef = useRef<WebSocket | null>(null);
    const gridRef = useRef<GridStackType | null>(null);
    const widgetRoots = useRef<Map<number, ReturnType<typeof createRoot>>>(new Map());
    const parserRef = useRef<CANParser | null>(null);

    const [count, setCount] = useState(0);
    const [canMessages, setCanMessages] = useState<EnhancedCanMessage[]>([]);
    const [widgets, setWidgets] = useState<Widgets[]>([]);

    useEffect(() => {
        if (!parserRef.current && dbcData) {
            parserRef.current = new CANParser(dbcData);
        }
    }, [dbcData]);

    useEffect(() => {
        wsRef.current = new WebSocket('ws://' + window.location.host + ':8080/ws');
        wsRef.current.onopen = () => setIsWSConnected(true);
        wsRef.current.onclose = () => setIsWSConnected(false);
        wsRef.current.onerror = () => setIsWSConnected(false);
        console.log(isWSConnected);

        return () => {
            wsRef.current?.close();
        };
    }, []);

    useEffect(() => {
        if (!wsRef.current) return;
        wsRef.current.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg['id'] != null) {
                    // HARDCODED!
                    if (parserRef.current) {
                        const enhancedMessage = parserRef.current.interpretMessage(msg);
                        if (wantLiveUpdate) {
                            setCanMessages((prev) => [...prev, enhancedMessage].slice(-1000));
                        }
                    } else {
                        if (wantLiveUpdate) {
                            setCanMessages((prev) => [...prev, msg].slice(-1000));
                        }
                    }
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };
    }, [wantLiveUpdate, shouldWSReconnect]);

    useEffect(() => {
        if (shouldWSReconnect) {
            if (wsRef.current) {
                wsRef.current.close();
            }
            wsRef.current = new WebSocket('ws://' + window.location.host + ':8080/ws');
            wsRef.current.onopen = () => setIsWSConnected(true);
            wsRef.current.onclose = () => setIsWSConnected(false);
            wsRef.current.onerror = () => setIsWSConnected(false);

            setShouldWSReconnect(false);
        }
    }, [shouldWSReconnect, setShouldWSReconnect, setIsWSConnected]);

    useEffect(() => {
        if (shouldClearMessages) {
            setCanMessages([]);
            setShouldClearMessages(false);
        }
    }, [shouldClearMessages, setShouldClearMessages]);

    useEffect(() => {
        // Dynamically import GridStack on the client side
        const initializeGridStack = async () => {
            const {GridStack} = await import('gridstack');

            gridRef.current = GridStack.init({
                float: true,
                cellHeight: '70px',
                minRow: 1,
                removable: false,
                draggable: { cancel: '.no-drag'}
            });//.load(initialItems);
        };

        initializeGridStack();

        // Cleanup function
        return () => {
            if (gridRef.current) {
                gridRef.current.destroy();
                // Cleanup all roots
                widgetRoots.current.forEach(root => root.unmount());
            }
        };
    }, []);

    useEffect(() => {
        widgets.forEach(widget => {
            const root = widgetRoots.current.get(widget.widgetID);
            const relevantCanMessages = canMessages.filter(msg => msg.id === widget.CANID);
            const lastCanMessage = relevantCanMessages.at(-1);

            if (root) {
                root.render(
                    <Card className="w-full h-full border-r">
                        <div className="cursor-move flex justify-between">
                            <div>ID: {widget.CANID === -1 ? "All" : widget.CANID.toString(16).padStart(3, '0').toUpperCase()}</div>
                            <div>{widget.widgetType}</div>
                            <DeleteButton onDelete={() => removeWidget(widget.widgetID)} />
                        </div>

                        {widget.widgetType === 'Table' ? (
                            <TableWidget messages={canMessages} />
                        ) : widget.widgetType === 'Number' ? (
                            <NumberWidget
                                signal={lastCanMessage?.signals[widget.signalID]/* ? lastCanMessage?.signals[widget.signalID] : dbcData?.messages.find(msg => msg.id === widget.CANID)?.signals[widget.signalID]*/}
                                timestamp={lastCanMessage?.timestamp}
                            />
                        ) : widget.widgetType === 'Hex' ? (
                            <HexWidget
                                signal={lastCanMessage?.signals[widget.signalID]/* ? lastCanMessage?.signals[widget.signalID] : dbcData?.messages.find(msg => msg.id === widget.CANID)?.signals[widget.signalID]*/}
                                timestamp={lastCanMessage?.timestamp}
                            />
                        ) : widget.widgetType === 'Binary' ? (
                            <BinaryWidget
                                signal={lastCanMessage?.signals[widget.signalID]/* ? lastCanMessage?.signals[widget.signalID] : dbcData?.messages.find(msg => msg.id === widget.CANID)?.signals[widget.signalID]*/}
                                timestamp={lastCanMessage?.timestamp}
                            />
                        ) : widget.widgetType === 'Gauge' ? (
                            <GaugeWidget
                                signal={lastCanMessage?.signals[widget.signalID]/* ? lastCanMessage?.signals[widget.signalID] : dbcData?.messages.find(msg => msg.id === widget.CANID)?.signals[widget.signalID]*/}
                                timestamp={lastCanMessage?.timestamp}
                            />
                        ) : null}
                    </Card>
                );
            }
        });
    }, [canMessages, dbcData, widgets]);

    // Neuer useEffect für das Hinzufügen von Widgets
    useEffect(() => {
        if (widgetToAdd) {
            addNewWidget(widgetToAdd.type, widgetToAdd.CANID, widgetToAdd.signalID);
            setWidgetToAdd(null); // Reset nach dem Hinzufügen
        }
    }, [widgetToAdd]);

    const addNewWidget = (type: string, CANID: number, signalID: number) => {
        if (!gridRef.current) return;

        const widgetId = count;
        const widgetElement = document.createElement('div');
        widgetElement.className = 'grid-stack-item';
        widgetElement.setAttribute('data-widget-id', widgetId.toString());
        switch (type) {
            case "Table":
                widgetElement.setAttribute('gs-w', '6');
                widgetElement.setAttribute('gs-h', '4');
                break;
            case "Number":
                widgetElement.setAttribute('gs-w', '2');
                widgetElement.setAttribute('gs-h', '2');
                break;
            case "Hex":
                widgetElement.setAttribute('gs-w', '2');
                widgetElement.setAttribute('gs-h', '2');
                break;
            case "Binary":
                widgetElement.setAttribute('gs-w', '2');
                widgetElement.setAttribute('gs-h', '2');
                break;
            case "Gauge":
                widgetElement.setAttribute('gs-w', '3');
                widgetElement.setAttribute('gs-h', '4');
                break;
        }

        const contentElement = document.createElement('div');
        contentElement.className = 'grid-stack-item-content';
        widgetElement.appendChild(contentElement);

        const root = createRoot(contentElement);
        widgetRoots.current.set(widgetId, root);

        gridRef.current.makeWidget(widgetElement);

        setWidgets(prev => [...prev, {widgetID: widgetId, widgetType: type, CANID: CANID, signalID: signalID}]);
        setCount(prev => prev + 1);
    };

    const removeWidget = (widgetId: number) => {
        const widgetElement = document.querySelector(`[data-widget-id="${widgetId}"]`) as GridItemHTMLElement;
        if (widgetElement && gridRef.current) {
            gridRef.current.removeWidget(widgetElement);
            const root = widgetRoots.current.get(widgetId);
            if (root) {
                root.unmount();
                widgetRoots.current.delete(widgetId);
            }
            setWidgets(prev => prev.filter(widget => widget.widgetID !== widgetId));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="grid-stack"></div>
        </div>
    );
}