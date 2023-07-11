const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      path.parse(file.originalname).name +
      "_" +
      Date.now() +
      path.extname(file.originalname)
    );
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
