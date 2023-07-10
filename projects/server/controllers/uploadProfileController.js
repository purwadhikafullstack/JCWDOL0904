const db = require("../models");
const multer = require("../middleware/multer");

module.exports = {
  uploadProfilePict: async (req, res) => {
    try {
      const id = req.body.id;
      console.log(id);

      const { file } = req;
      const filepath = file ? "http://localhost:8000/" + file.filename : null;
      console.log(file);

      // Update the profile picture in the database
      const result = await db.User.update(
        { user_image: filepath },
        { where: { id: id } }
      );

      res.status(200).send({
        message: "Profile picture updated successfully",
        result,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Error updating profile picture" });
    }
  },
};
