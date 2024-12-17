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

interface GridViewProps {
    isWSConnected: boolean;
    setIsWSConnected: (value: boolean) => void;
    shouldWSReconnect: boolean;
    setShouldWSReconnect: (value: boolean) => void;
    wantLiveUpdate: boolean;
    shouldClearMessages: boolean;
    setShouldClearMessages: (value: boolean) => void;
    dbcData: DBCData | null;
}

interface Widgets {
    widgetID: number;
    widgetType: string;
}

export default function GridStackComponent({
                                               isWSConnected,
                                               setIsWSConnected,
                                               shouldWSReconnect,
                                               setShouldWSReconnect,
                                               wantLiveUpdate,
                                               shouldClearMessages,
                                               setShouldClearMessages,
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
                    if (parserRef.current) {
                        const enhancedMessage = parserRef.current.interpretMessage(msg);
                        if (wantLiveUpdate) {
                            setCanMessages((prev) => [...prev, enhancedMessage]);
                        }
                    } else {
                        if (wantLiveUpdate) {
                            setCanMessages((prev) => [...prev, msg]);
                        }
                    }
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };
    }, [wantLiveUpdate, shouldWSReconnect]); // Abhängigkeit hinzufügen

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
            });//.load(initialItems);

            /*
            gridRef.current.on('dragstop', (_event: Event, element: Any) => {

                const node = element.gridstackNode;
                setInfo(`you just dragged node #${node.id} to ${node.x},${node.y} – good job!`);

                // Clear the info text after a two second timeout
                setTimeout(() => {
                    setInfo('');
                }, 2000);
            });

             */
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
            if (root) {
                switch (widget.widgetType) {
                    case "Table":
                        root.render(
                            <Card className="w-full h-full border-r">
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                    <div>ID</div>
                                    <div>Table</div>
                                    <DeleteButton onDelete={() => removeWidget(widget.widgetID)}/>
                                </div>
                                <TableWidget messages={canMessages}/>
                            </Card>
                        );
                        break;
                    case "Number":
                        // HARDCODED!
                        const relevantCanMessages = canMessages.filter(msg => msg.id === 10);
                        const lastCanMessage = relevantCanMessages.at(-1);

                        root.render(
                            <Card className="w-full h-full border-r">
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                    <div>ID: 10</div>
                                    <div>Number</div>
                                    <DeleteButton onDelete={() => removeWidget(widget.widgetID)}/>
                                </div>
                                <NumberWidget signal={lastCanMessage?.signals[1]} timestamp={lastCanMessage?.timestamp}/>
                            </Card>
                        );
                        break;
                    default:
                        root.render(
                            <Card className="w-full h-full border-r">
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                    <div>ID</div>
                                    <div>Unbekannt</div>
                                    <DeleteButton onDelete={() => removeWidget(widget.widgetID)}/>
                                </div>
                            </Card>
                        );
                        break;
                }
            }
        });
    }, [canMessages, dbcData, widgets]);

    const addNewWidget = (type: string) => {
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
        }


        const contentElement = document.createElement('div');
        contentElement.className = 'grid-stack-item-content';
        widgetElement.appendChild(contentElement);

        const root = createRoot(contentElement);
        widgetRoots.current.set(widgetId, root);

        switch (type) {
            case "Table":
                root.render(
                    <Card className="w-full h-full border-r">
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <div>ID</div>
                            <div>Table</div>
                            <DeleteButton onDelete={() => removeWidget(widgetId)}/>
                        </div>
                        <TableWidget messages={canMessages}/>
                    </Card>
                );
                break;
            case "Number":
                // HARDCODED!
                const relevantCanMessages = canMessages.filter(msg => msg.id === 10);
                const lastCanMessage = relevantCanMessages.at(-1);

                root.render(
                    <Card className="w-full h-full border-r">
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <div>ID: 10</div>
                            <div>Number</div>
                            <DeleteButton onDelete={() => removeWidget(widgetId)}/>
                        </div>
                        <NumberWidget signal={lastCanMessage?.signals[1]} timestamp={lastCanMessage?.timestamp}/>
                    </Card>
                );
                break;
            default:
                root.render(
                    <Card className="w-full h-full border-r">
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <div>ID</div>
                            <div>Unbekannt</div>
                            <DeleteButton onDelete={() => removeWidget(widgetId)}/>
                        </div>
                    </Card>
                );
                break;
        }

        gridRef.current.makeWidget(widgetElement);
        setWidgets(prev => [...prev, {widgetID: widgetId, widgetType: type}]);
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
            <button
                type="button"
                onClick={() => addNewWidget("Table")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
                Add Table
            </button>
            <button
                type="button"
                onClick={() => addNewWidget("Number")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
                Add Number
            </button>
            {/*info && <p className="mb-4 text-green-600">{info}</p>*/}
            <div className="grid-stack"></div>
        </div>
    );
}