const { Server } = require("socket.io");

const io = new Server(5000, {
    cors: {
        origin: "http://localhost:3000",
        allowedHeaders: ["my-custom-header"],
        credentials: true,
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    const id = socket.handshake.query.id;
    socket.join(id);    

    socket.on('sendMessage', ( {recipients, text} ) => {
        recipients.forEach(recipient => {
            const newRecipients = recipients.filter(r => r !== recipient);
            newRecipients.push(id);
            socket.to(recipient).emit('receiveMessage', { recipients: newRecipients, text, sender: id});   
        })
    })
})

