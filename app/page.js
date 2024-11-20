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

    // Neue Funktion zum Hinzufügen eines Widgets
    const addWidget = () => {
        const newItem = {
            x: 0, // Standardposition
            y: 0,
            w: 4,
            h: 2,
            id: `widget-${items.length}`, // Einzigartige ID
            content: 'chart', // Standardmäßig ein Chart-Widget
        };

        setItems((prevItems) => [...prevItems, newItem]); // Neues Widget hinzufügen
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
                                {/* Render the widget */}
                                {renderWidget(document.createElement('div'), item.content)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
