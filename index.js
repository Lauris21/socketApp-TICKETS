const express = require('express');

const dotenv = require('dotenv');
dotenv.config();

const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT;

const app = express();

const cors = require('cors');

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.static('public'));

const server = require('http').createServer(app);

const io = require('socket.io')(server);
const { socketController } = require('./sockets/socket.controller');

io.on('connection', socketController);

server.listen(PORT, () => {
  console.log(`Listening on PORT ${BASE_URL}${PORT}`);
});
