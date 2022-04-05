const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");
const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
    debug: true,
});
const port = (process.env.PORT || 3000);
app.use("/peerjs", peerServer);
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
const mongoose = require('mongoose');
// let Message = mongoose.model('Message', {
//     name: String,
//     message: String
// })

const dbUrl = 'mongodb+srv://SomeBodyOnceToldMe:TheWorldIsGonnaRollMe@message0.2qcjp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

// app.get('/messages', (req, res) => {
//     Message.find({}, (err, messages) => {
//         res.send(messages);
//     })
// })


// app.get('/messages/:user', (req, res) => {
//     let user = req.params.user
//     Message.find({ name: user }, (err, messages) => {
//         res.send(messages);
//     })
// })


// app.post('/messages', async (req, res) => {
//     try {
//         let message = new Message(req.body);

//         let savedMessage = await message.save()
//         console.log('saved');

//         let censored = await Message.findOne({ message: 'badword' });
//         if (censored)
//             await Message.remove({ _id: censored.id })
//         else
//             io.emit('message', req.body);
//         res.sendStatus(200);
//     }
//     catch (error) {
//         res.sendStatus(500);
//         return console.log('error', error);
//     }
//     finally {
//         console.log('Message Posted')
//     }

// });

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
    res.render("room", { roomId: req.params.room });
});

io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
});

io.on("connection", (socket) => {

    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);
    });

    socket.on("disconnect", () => {
        console.log("someone disconnected");
    })
});

// mongoose.connect(dbUrl, { appName: "something" }).then(() => console.log('connected'))
//     .catch(e => console.log(e));

server.listen(port, () => {
    console.log('server is running on port', server.address().port);
});