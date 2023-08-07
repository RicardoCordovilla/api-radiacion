const { Server } = require('socket.io')
const io = new Server({
    cors: { origin: "*" }
})

// io.listen(3500)

io.on("connection", (socket) => {
    console.log("somone new conection")

    io.emit("update", "new register")
    socket.on("disconnect", () => {
        console.log("someone left")
    })
})
