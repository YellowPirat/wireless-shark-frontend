'use client';

import React, {createElement, useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {GridStack as GridStackType, GridStackWidget} from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import TableWidget from "@/components/widgets/TableWidget";
import {getDocumentElement} from "@floating-ui/utils/dom";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import { X } from 'lucide-react';

export default function GridStackComponent() {
    const [count, setCount] = useState(0);
    const [info, setInfo] = useState('');
    const gridRef = useRef<GridStackType | null>(null);

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
            await import('gridstack/dist/gridstack.min.css');

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
            }
        };
    }, []);

    const addNewWidget = () => {
        if (!gridRef.current) return;

        // Erstelle das Widget-Element
        const widgetElement = document.createElement('div');
        widgetElement.className = 'grid-stack-item';

        // Erstelle das Content-Element
        const contentElement = document.createElement('div');
        contentElement.className = 'grid-stack-item-content';
        widgetElement.appendChild(contentElement);

        // Erstelle React Root und render die Komponente
        const root = createRoot(contentElement);
        root.render(
            <Card className="w-full h-full border-r ">
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div>ID</div>
                        <div>Table</div>
                        <button
                        onClick={() => {
                            // Remove widget from grid
                            gridRef.current?.removeWidget(widgetElement);
                            // Unmount React component
                            root.unmount();
                        }}
                        className="w-5 text-gray-800 z-20"
                        aria-label="Delete widget"
                    ><X size={16} /></button>
                    </div>
                <CardContent>
                    <TableWidget/>
                </CardContent>
            </Card>
        );

        // Füge das Widget zum Grid hinzu
        gridRef.current.makeWidget(widgetElement);

        setCount(prevCount => prevCount + 1);
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