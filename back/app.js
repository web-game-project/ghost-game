const express = require('express');
const Http = require('http');
const socket = require('./socket/socket');

const {
    loginRouter,
    roomRouter,
    waitingRoomRouter,
    gameRouter,
} = require('./router');
//const { authMiddleware } = require('./middleware')
const PORT = 8080;

const app = express();
const server = Http.createServer(app);
socket(server, app);

app.get('/', (req, res) => {
    res.send('success');
});
app.use(express.json());
app.use('/login', loginRouter);
app.use('/room', roomRouter);
app.use('/waiting-room', waitingRoomRouter);
app.use('/game', gameRouter);

server.listen(PORT, () => {
    console.log(`listening at ${PORT}`);
});
