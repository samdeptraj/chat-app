const multer = require("multer");
const fs = require('fs');
const path = require('path');

// Đường dẫn chính xác tới thư mục lưu ảnh
const avatarDir = path.join(__dirname, '../../public/images/avatars');
console.log('avatarDir: ', avatarDir);

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, avatarDir);  // Sử dụng đường dẫn tuyệt đối tới thư mục avatars
    },
    filename: (req, file, cb) => {
        // const ext = path.extname(file.originalname);
        cb(null, Date.now() + "_" + file.originalname);  // Đặt tên file với timestamp
    }
});
const upload = multer({ storage });

const profileFilePath = path.join(__dirname, 'profiles.json');
let profiles = [];



module.exports = {
    upload
};
//neu ten user da ton tai thi update url
