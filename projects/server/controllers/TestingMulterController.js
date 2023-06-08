const db = require("../models")
const fakeuser = db.FakeUser

module.exports = {
    CreateFakeUser: async (req, res) => {
        try {
            // const { name } = req.body;

            console.log(req.file);
            const { file } = req
            const filepath = file ?  "/" + file.filename : null

            const result = await fakeuser.create({
                profile_image: process.env.IMAGE_URL + filepath,
            });
            res.status(200).send({
                message: "Register fakeuser Success",
                result,
            });
        } catch (err) {
            console.log(err);
        }
    }
}