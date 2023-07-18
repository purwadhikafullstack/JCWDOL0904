const db = require("../models");
const multer = require("../middleware/multer");

module.exports = {
  uploadProfilePict: async (req, res) => {
    try {
      const { id } = req.dataToken;

      const { file } = req;
      const filepath = file ? "http://localhost:8000/" + file.filename : null;

      const result = await db.User.update(
        { user_image: filepath },
        { where: { id: id } }
      );

      res.status(200).send({
        message: "Profile picture updated successfully",
        result,
        id,
      });
    } catch (err) {
      res.status(500).send({ message: "Error updating profile picture" });
    }
  },
};
