const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filePath = path.join(__dirname, "../public/images");
    console.log(filePath);
    cb(null, filePath);
  },
  filename: function (req, file, cb) {
    const fileName =
      path.parse(file.originalname).name +
      "" +
      Date.now() +
      path.extname(file.originalname);

    console.log(fileName);
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  //   fileFilter: function (req, file, cb) {
  //     // console.log(file.size);
  //     cb(null, true);
  //   },

  limits: { fileSize: 1048576 },
});

module.exports = upload;
