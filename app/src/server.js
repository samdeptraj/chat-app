const express = require("express");
const path = require('path');
const http = require('http');
const { initSocket } = require("../socket");
const { upload, saveProfile } = require("./utils/multer");
const profiles = require('./utils/profiles.json');
const app = express();
const PORT = 8000;
const server = http.createServer(app);
// Đường dẫn tới thư mục public
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

initSocket(server);

// Route upload avatar
app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
    const file = req.file;
    const { username } = req.body;
    const avatarUrl = `/images/avatars/${file.filename}`;
    res.json({ username, avatarUrl });
});

server.listen(process.env.PORT || PORT, () => {
    console.log("App listening on port " + PORT);
});
