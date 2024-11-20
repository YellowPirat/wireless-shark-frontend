"use client";

import { useEffect, useState } from "react";
import { socket } from "./socket";
import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
import { createRoot } from 'react-dom/client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const testdata = [
    {
        "name": "Page A",
        "uv": 4000,
        "pv": 2400,
        "amt": 2400
    },
    {
        "name": "Page B",
        "uv": 3000,
        "pv": 1398,
        "amt": 2210
    },
    {
        "name": "Page C",
        "uv": 2000,
        "pv": 9800,
        "amt": 2290
    },
    {
        "name": "Page D",
        "uv": 2780,
        "pv": 3908,
        "amt": 2000
    },
    {
        "name": "Page E",
        "uv": 1890,
        "pv": 4800,
        "amt": 2181
    },
    {
        "name": "Page F",
        "uv": 2390,
        "pv": 3800,
        "amt": 2500
    },
    {
        "name": "Page G",
        "uv": 3490,
        "pv": 4300,
        "amt": 2100
    }
]

// Widgets
const ClockWidget = () => (
    <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2">Uhr</h3>
        <div id="clock" className="text-2xl">{new Date().toLocaleTimeString()}</div>
    </div>
)

const ChartWidget = () => (
    <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2">Chart</h3>
        <div className="h-48 bg-gray-100 flex items-center justify-center">
            Chart Platzhalter
        </div>
    </div>
)

const WeatherWidget = () => (
    <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2">Wetter</h3>
        <div>23°C, Sonnig</div>
    </div>
)

const WIDGET_MAP = {
    clock: ClockWidget,
    weather: WeatherWidget,
    chart: ChartWidget
}

const DEFAULT_WIDGETS = [
    { x: 0, y: 0, w: 4, h: 2, id: 'clock', content: 'clock' },
    { x: 4, y: 0, w: 4, h: 2, id: 'weather', content: 'weather' },
    { x: 8, y: 0, w: 4, h: 6, id: 'chart', content: 'chart' }
]

const renderWidget = (container, widgetType) => {
    const Widget = WIDGET_MAP[widgetType]
    if (Widget) {
        const root = createRoot(container)
        root.render(<Widget />)
        return root
    }
    return null
}

export default function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [messages, setMessages] = useState([]);

    const [grid, setGrid] = useState(null);
    const [items, setItems] = useState(DEFAULT_WIDGETS);

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        function onCANMessage(msg) {
            console.log(msg);
            setMessages([...messages, msg]);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("can-message", onCANMessage);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, [messages]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const gridInstance = GridStack.init({
                float: true,
                removable: true,
                removeTimeout: 100,
                margin: 10,
                cellHeight: 300,
                minRow: 2,
            });
            setGrid(gridInstance);

            return () => {
                gridInstance.destroy();
            };
        }
    }, []);

    const addWidget = () => {
        const newItem = {
            x: 0,
            y: 0,
            w: 4,
            h: 2,
            id: `widget-${items.length}`,
            content: 'chart',
        };
        setItems((prevItems) => [...prevItems, newItem]);
    };

    const saveLayout = () => {
        const layout = JSON.stringify(items);
        localStorage.setItem('dashboard-layout', layout);
        alert('Layout gespeichert!');
    };

    const loadLayout = () => {
        const layout = localStorage.getItem('dashboard-layout');
        if (layout) {
            setItems(JSON.parse(layout));
        }
    };

    const clearAll = () => {
        if (grid) {
            grid.removeAll();
            setItems([]);
        }
    };

    return (
        <div>
            <p>Status: {isConnected ? "connected" : "disconnected"}</p>
            <p>Transport: {transport}</p>
            <div>
                <button
                    onClick={clearAll}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Alle löschen
                </button>
                <button
                    onClick={saveLayout}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Layout speichern
                </button>
                <button
                    onClick={loadLayout}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Layout laden
                </button>

                {/* Neuer Button zum Hinzufügen eines Widgets */}
                <button
                    onClick={addWidget}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                    Widget hinzufügen
                </button>

                <div className="grid-stack">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="grid-stack-item"
                            gs-x={item.x}
                            gs-y={item.y}
                            gs-w={item.w}
                            gs-h={item.h}
                            gs-id={item.id}
                        >
                            <div className="grid-stack-item-content">
                                {renderWidget(document.createElement('div'), item.content)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
