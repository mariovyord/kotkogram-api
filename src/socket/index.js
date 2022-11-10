module.exports = (io) => {
    const messageIo = io.of('/socket/message')

    messageIo.use((socket, next) => {
        next();
    })

    messageIo.on('connection', socket => {

        socket.on('message', (msg) => {
            messageIo.emit('message', `${msg}`);
        })

        socket.on('disconnect', () => console.log('disconnected'));

    })
}