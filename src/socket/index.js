const jwt = require('jsonwebtoken');

module.exports = (io) => {
    const messageIo = io.of('/socket/message')

    messageIo.use((socket, next) => {
        const cookie = socket.request.headers.cookie
        authenticateToken(cookie, socket, next);
    })

    messageIo.on('connection', socket => {
        socket.on('message', (msgObj) => {
            messageIo.emit('message', msgObj);
        })

        socket.broadcast.emit('message', 'A user has joined')

        socket.on('disconnect', () => {
            messageIo.emit('message', 'A user has left the chat')
        });

    })
}

function authenticateToken(cookie, socket, next) {
    const [, accessToken] = cookie.split('=');

    if (!accessToken) {
        socket.disconnect(1);
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, (err) => {
        if (err) {
            socket.disconnect(1);
        } else {
            next();
        }
    })
}