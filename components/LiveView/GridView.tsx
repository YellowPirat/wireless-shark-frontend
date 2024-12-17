'use client';

import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {GridItemHTMLElement, GridStack as GridStackType } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import TableWidget from "@/components/widgets/TableWidget";
import { Card } from "@/components/ui/card";

import {DBCData} from "@/components/DBCParser/DBCParser";
import DeleteButton from "@/components/custom-ui/DeleteButton"

interface GridViewProps {
    isWSConnected: boolean;
    setIsWSConnected: (value: boolean) => void;
    dbcData: DBCData | null;
}


interface CanMessage {
    id: number; // Die ID wird als Hex-String dargestellt
    timestamp: string | Date; // Zeitstempel der Nachricht
    data: Uint8Array | number[]; // Rohdaten als Uint8Array oder ähnliches typisiertes Array
    length: number; // Länge der Nachricht
}

export default function GridStackComponent({ isWSConnected, setIsWSConnected, dbcData }: GridViewProps) {
    const wsRef = useRef<WebSocket | null>(null);
    const gridRef = useRef<GridStackType | null>(null);
    const widgetRoots = useRef<Map<number, ReturnType<typeof createRoot>>>(new Map());

    const [count, setCount] = useState(0);
    // const [info, setInfo] = useState('');
    const [canMessages, setCanMessages] = useState<CanMessage[]>([]);
    const [widgets, setWidgets] = useState<number[]>([]);

    useEffect(() => {
        wsRef.current = new WebSocket('ws://' + window.location.host + ':8080/ws');
        wsRef.current.onopen = () => setIsWSConnected(true);
        wsRef.current.onclose = () => setIsWSConnected(false);
        wsRef.current.onerror = () => setIsWSConnected(false);

        wsRef.current.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg['id'] != null) {
                    setCanMessages((prev) => [...prev, msg]);
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        console.log(isWSConnected);

        return () => {
            wsRef.current?.close();
        };
    }, []);

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
        widgets.forEach(widgetId => {
            const root = widgetRoots.current.get(widgetId);
            if (root) {
                root.render(
                    <Card className="w-full h-full border-r">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>ID</div>
                            <div>Table</div>
                            <DeleteButton onDelete={() => removeWidget(widgetId)} />
                        </div>
                        <TableWidget messages={canMessages} />
                    </Card>
                );
            }
        });
    }, [canMessages]);

    const removeWidget = (widgetId: number) => {
        const widgetElement = document.querySelector(`[data-widget-id="${widgetId}"]`) as GridItemHTMLElement;
        if (widgetElement && gridRef.current) {
            gridRef.current.removeWidget(widgetElement);
            const root = widgetRoots.current.get(widgetId);
            if (root) {
                root.unmount();
                widgetRoots.current.delete(widgetId);
            }
            setWidgets(prev => prev.filter(id => id !== widgetId));
        }
    };

    const addNewWidget = () => {
        if (!gridRef.current) return;

        // setCanMessages(prev => [...prev, {id: 42, timestamp: new Date(), data: [42,42,42,42], length: 4}]);

        const widgetId = count;
        const widgetElement = document.createElement('div');
        widgetElement.className = 'grid-stack-item';
        widgetElement.setAttribute('data-widget-id', widgetId.toString());
        widgetElement.setAttribute('gs-w', '6');
        widgetElement.setAttribute('gs-h', '4');

        const contentElement = document.createElement('div');
        contentElement.className = 'grid-stack-item-content';
        widgetElement.appendChild(contentElement);

        const root = createRoot(contentElement);
        widgetRoots.current.set(widgetId, root);

        root.render(
            <Card className="w-full h-full border-r">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>ID</div>
                    <div>Table</div>
                    <DeleteButton onDelete={() => removeWidget(widgetId)} />
                </div>
                <TableWidget messages={canMessages} dbcData={dbcData} />
            </Card>
        );

        gridRef.current.makeWidget(widgetElement);
        setWidgets(prev => [...prev, widgetId]);
        setCount(prev => prev + 1);
    };

    return (
        <div className="container mx-auto p-4">
            <button
                type="button"
                onClick={addNewWidget}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
                Add Widget
            </button>
            {/*info && <p className="mb-4 text-green-600">{info}</p>*/}
            <div className="grid-stack"></div>
        </div>
    );
}