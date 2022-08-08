const { Server } = require("socket.io");

const io = new Server(5000, {
    cors: {
        origin: "http://localhost:3000",
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});


io.on('connection', (socket) => {
    const id = socket.handshake.query.id;
    socket.join(id);

    console.log(socket.id, 'connected');

    socket.on('sendMessage', ( recipients, text ) => {
        console.log("aloooo");
        recipients.forEach(recipient => {
            const newRecipients = recipients.filter(r => r !== recipient);
            newRecipients.push(id);
            console.log(newRecipients);
            const operator = socket.broadcast
            operator.emit('receiveMessage', { recipients: newRecipients, text, sender: id });
            socket.to(recipient).emit('receiveMessage', { recipients: newRecipients, text, sender: id });
            // socket.broadcast.to(recipient).emit('receive-message', {
            //     recipients: newRecipients, text, sender: id
            // });
        })
    })
})

