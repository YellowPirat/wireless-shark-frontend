// app/components/GridStack.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GridStack as GridStackType } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

interface GridItem {
    x: number;
    y: number;
    w?: number;
    h?: number;
    id?: string;
    content?: string;
}

export default function GridStackComponent() {
    const [count, setCount] = useState(0);
    const [info, setInfo] = useState('');
    const gridRef = useRef<GridStackType | null>(null);

    const initialItems: GridItem[] = [
        { x: 2, y: 1, h: 2, content: "hi" },
        { x: 2, y: 4, w: 3, content: "hi" },
        { x: 4, y: 2, content: "hi" },
        { x: 3, y: 1, h: 2, content: "hi" },
        { x: 0, y: 6, w: 2, h: 2, content: "hi" },
    ];

    useEffect(() => {
        // Dynamically import GridStack on the client side
        const initializeGridStack = async () => {
            const { GridStack } = await import('gridstack');
            await import('gridstack/dist/gridstack.min.css');

            gridRef.current = GridStack.init({
                float: true,
                cellHeight: '70px',
                minRow: 1,
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

        const node: GridItem = initialItems[count] || {
            x: Math.round(12 * Math.random()),
            y: Math.round(5 * Math.random()),
            w: Math.round(1 + 3 * Math.random()),
            h: Math.round(1 + 3 * Math.random()),
        };

        node.id = String(count);
        node.content = "Hallo";

        setCount(prevCount => prevCount + 1);
        gridRef.current.addWidget(node);
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