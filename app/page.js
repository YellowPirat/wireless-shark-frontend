"use client";

import { useEffect, useState } from "react";
import { socket } from "./socket";
// import { socket } from "socket.io-client";

export default function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
//	    console.log(transport);
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
//	    console.log(transport);
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        function onCANMessage(msg) {
//	    console.log("CAN");
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

    return (
        <div>
            <p>Status: {isConnected ? "connected" : "disconnected"}</p>
            <p>Transport: {transport}</p>
            <div>
<ul>
{messages.map(message => <li key={message.id}>ID: {message.id} Time: {Date(message.ts_sec*1000+message.ts_sec/1000)} Data: {new Uint8Array(message.data)}</li>)}
</ul>
            </div>
        </div>
    );
}
