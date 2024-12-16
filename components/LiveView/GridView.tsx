'use client';

import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {GridStack as GridStackType, GridStackWidget} from 'gridstack';
import TableWidget from "@/components/widgets/TableWidget";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import { X } from 'lucide-react';

export default function GridStackComponent() {
    const [count, setCount] = useState(0);
    const [info, setInfo] = useState('');
    const gridRef = useRef<GridStackType | null>(null);
    const [canMessages, setCanMessages] = useState([]);
    const widgetRoots = useRef<Map<number, ReturnType<typeof createRoot>>>(new Map());
    const [widgets, setWidgets] = useState<number[]>([]);

    const initialItems: GridStackWidget[] = [
        {x: 2, y: 1, h: 2, content: "hi"},
        {x: 2, y: 4, w: 3, content: "hi"},
        {x: 4, y: 2, content: "hi"},
        {x: 3, y: 1, h: 2, content: "hi"},
        {x: 0, y: 6, w: 2, h: 2, content: "hi"},
    ];

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

            gridRef.current.on('dragstop', (_event: Event, element: any) => {
                const node = element.gridstackNode;
                setInfo(`you just dragged node #${node.id} to ${node.x},${node.y} – good job!`);

                // Clear the info text after a two second timeout
                setTimeout(() => {
                    setInfo('');
                }, 2000);
            });
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
                            <button
                                onClick={() => removeWidget(widgetId)}
                                className="w-5 text-gray-800 z-20"
                                aria-label="Delete widget"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <TableWidget messages={canMessages} />
                    </Card>
                );
            }
        });
    }, [canMessages]);

    const removeWidget = (widgetId: number) => {
        const widgetElement = document.querySelector(`[data-widget-id="${widgetId}"]`);
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

        setCanMessages(prev => [...prev, "Hallo"]);

        const widgetId = count;
        const widgetElement = document.createElement('div');
        widgetElement.className = 'grid-stack-item';
        widgetElement.setAttribute('data-widget-id', widgetId.toString());

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
                    <button
                        onClick={() => removeWidget(widgetId)}
                        className="w-5 text-gray-800 z-20"
                        aria-label="Delete widget"
                    >
                        <X size={16} />
                    </button>
                </div>
                <TableWidget messages={canMessages} />
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
            {info && <p className="mb-4 text-green-600">{info}</p>}
            <div className="grid-stack"></div>
        </div>
    );
}