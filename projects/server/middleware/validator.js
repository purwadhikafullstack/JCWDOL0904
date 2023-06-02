const access = process.env.KEY_ACCESS

module.exports = (req, res, next) => {
        console.log("aaaa", req.headers.key);
        console.log("bbbb", access);
        if (req.headers.key == access) {
                // res.send("Suksess akses")
                return next()
        }
        res.status(500).send({ message: "Authorization failed" })
} 