const axios = require("axios")

module.exports = {
    getProvince: async (req, res) => {
        try {
            let { keyy } = req.headers
            let data = await axios.get('https://api.rajaongkir.com/starter/province', {
                headers: {
                    "key": keyy
                }
            })
            // console.log(data)
            res.status(200).send({
                isError: false,
                message: 'Get Province Success',
                data: data.data.rajaongkir.results
            })
        } catch (error) {
            res.status(400).send({
                message: error.message,
            })
        }
    },
    getCities: async (req, res) => {
        try {
            let { keyy } = req.headers

            const { province } = req.query;

            const data = await axios.get('https://api.rajaongkir.com/starter/city', {
                headers: {
                    "key": keyy // Ganti dengan API key Raja Ongkir Anda
                },
                params: {
                    province
                }
            });
            // console.log(data)
            res.status(200).send({
                isError: false,
                message: 'Get Province Success',
                data: data.data.rajaongkir.results
            })
        } catch (error) {
            res.status(400).send({
                message: error.message,
            })
        }
    }
}