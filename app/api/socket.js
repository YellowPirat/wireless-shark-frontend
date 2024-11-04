import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
    if (res.socket.server.io) {
        console.log('Socket is already running');
        io.emit('can-message');
    } else {
        console.log('Socket is initializing');
        const io = new Server(res.socket.server);
        res.socket.server.io = io;
/*
        const channel = 'can0';
        const canNetwork = new can.Raw();
        canNetwork.bind(channel);

        canNetwork.on('onMessage', (msg) => {
            io.emit('can-message', msg);
        });*/
        io.emit('can-message', 'hello world');
    }
    res.end();
}

export default SocketHandler;