import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
// var can = require("socketcan");
// import { can } from "socketcan";
//import pkg from 'socketcan';
//const { can } = pkg;
import * as can from "socketcan";


const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        // socket.emit("hello", {"id": "Test", "data":"Wichtige Daten"});
    });


    var channel = can.createRawChannel("vcan0", true);
    channel.addListener("onMessage", function(msg) { io.emit("can-message", msg); } );
    channel.start();

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
