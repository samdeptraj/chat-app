const express = require("express");
const path = require('path');
const http = require('http');
const { createMessages } = require("./utils/create-messages");
const { initSocket } = require("../socket");

const app = express();
const PORT = 8000;
const server = http.createServer(app);

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));
initSocket(server);

server.listen(process.env.PORT || PORT, () => {
    console.log("App listening on port " + PORT);
});

//12