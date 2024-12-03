"use client";
// import React from 'react';

import Link from 'next/link'
import { usePathname } from 'next/navigation';

import { useEffect, useState } from "react";
import { socket } from "./socket";
import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
import { createRoot } from 'react-dom/client'

import React from 'react';

import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

// import Plot from 'react-plotly.js';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


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

    const [grid, setGrid] = useState(null)
    const [items, setItems] = useState(DEFAULT_WIDGETS)

    const pathname = usePathname();
    const isActive = (href) => {
        return pathname === href
    };


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
                minRow: 2
            })
            setGrid(gridInstance)
/*
            // Event Listener für Änderungen
            gridInstance.on('change', () => {
                const newItems = gridInstance.getGridItems().map(el => ({
                    x: el.gridstackNode.x,
                    y: el.gridstackNode.y,
                    w: el.gridstackNode.w,
                    h: el.gridstackNode.h,
                    id: el.gridstackNode.id,
                    content: el.gridstackNode.content
                }))
                setItems(newItems)
            })
*/
            return () => {
                gridInstance.destroy()
            }
        }
    }, [])


/*
    const createLineChart = () => {
        return (
            <ResponsiveContainer id="toll" width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={testdata}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        );
    };
*/
    /*
    useEffect(() => {
        if (grid) {
            grid.removeAll()
            items.forEach(item => {
                const div = document.createElement('div')
                div.className = 'grid-stack-item'
                div.setAttribute('gs-x', item.x)
                div.setAttribute('gs-y', item.y)
                div.setAttribute('gs-w', item.w)
                div.setAttribute('gs-h', item.h)
                div.setAttribute('gs-id', item.id)

                const content = document.createElement('div')
                content.className = 'grid-stack-item-content'
                /*
                const respCon = document.createElement("ResponsiveContainer")

                //respCon.setAttribute('width', "100")
                //respCon.setAttribute('height', "100")
                const lineChrt = document.createElement('LineChart')
                lineChrt.setAttribute('width', 50)
                lineChrt.setAttribute('height', 30)
                lineChrt.setAttribute('data', testdata)
                lineChrt.setAttribute('margin', {
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                })

                const cGrid = document.createElement('CartesianGrid')
                cGrid.setAttribute('strokeDasharray', "3 3")

                const xAxis = document.createElement('XAxis')
                xAxis.setAttribute('dataKey', "name")

                const yAxis = document.createElement('YAxis')
                const toolT = document.createElement('Tooltip')
                const legen = document.createElement('Legend')
                const line1 = document.createElement('Line')
                line1.setAttribute('type', "monotone")
                line1.setAttribute('dataKey', "pv")
                line1.setAttribute('stroke', "#8884d8")
                line1.setAttribute('activeDot', { r: 8 })

                const line2 = document.createElement('Line')
                line2.setAttribute('type', "monotone")
                line2.setAttribute('dataKey', "uv")
                line2.setAttribute('stroke', "#82ca9d")

                lineChrt.appendChild(cGrid)
                lineChrt.appendChild(xAxis)
                lineChrt.appendChild(yAxis)
                lineChrt.appendChild(toolT)
                lineChrt.appendChild(legen)
                lineChrt.appendChild(line1)
                lineChrt.appendChild(line2)

                respCon.appendChild(lineChrt)

                content.appendChild(respCon)


                // div.appendChild(createLineChart())
                div.id = "wichtig";
                div.innerHTML = createLineChart().innerHTML

                //createLineChart()

                // respCon.setAttribute('style', 'background-color: #00ff00')
                // grid.makeWidget('#toll')
                grid.addWidget(div)
            })
        }
    }, [grid, items])

*/
    const saveLayout = () => {
        const layout = JSON.stringify(items)
        localStorage.setItem('dashboard-layout', layout)
        alert('Layout gespeichert!')
    }

    const loadLayout = () => {
        const layout = localStorage.getItem('dashboard-layout')
        if (layout) {
            setItems(JSON.parse(layout))
        }
    }

    const clearAll = () => {
        if (grid) {
            grid.removeAll()
            setItems([])
        }
    }

    return (
        <div>
            <NavigationMenu className="!max-w-full !block">
                <NavigationMenuList>
                    <NavigationMenuItem className={cn( "flex-1", isActive('/') ? 'bg-accent text-accent-foreground' : 'bg-muted')}>
                        <Link href="/">Home</Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className={cn( "flex-1", isActive('/upload') ? 'bg-accent text-accent-foreground' : 'bg-muted')}>
                        <Link href="/upload">Image Upload</Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className={cn( "flex-1", isActive('/settings') ? 'bg-accent text-accent-foreground' : 'bg-muted')}>
                        <Link href="/settings">Settings</Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Home
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/liveView" legacyBehavior passHref>
                            <NavigationMenuLink  className={navigationMenuTriggerStyle()}>
                                Live View
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem  className={navigationMenuTriggerStyle()}>
                        <Link href="/settings" legacyBehavior passHref>
                            <NavigationMenuLink>
                                Settings
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

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

                <div className="grid-stack">
                    <div className="grid-stack-item">
                        <div className="grid-stack-item-content">
                            <table>
                                <thead>
                                <tr>
                                    <th>CAN ID</th>
                                    <th>Timestamp</th>
                                    <th>Data</th>
                                </tr>
                                </thead>
                                <tbody>
                                {messages.map((message, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{message.id}</td>
                                            <td>{new Date(message.ts_sec * 1000 + message.ts_usec / 1000).toISOString()}</td>
                                            <td>{new Uint8Array(message.data).toString('16')}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="grid-stack-item">
                        <div className="grid-stack-item-content">

                            Zahl:
                            {messages.at(-1) ? new Uint8Array(messages.at(-1).data).toString('16') : 42}
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            );
            }
