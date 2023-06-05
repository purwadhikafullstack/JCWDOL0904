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

            const { id_province } = req.query;

            const data = await axios.get('https://api.rajaongkir.com/starter/city', {
                headers: {
                    "key": keyy
                },
                params: {
                    id_province
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
    },
    postOngkir: async (req, res) => {
        try {
            let { origin, destination, weight, courier } = req.body
            let { keyy } = req.headers
            let data = await axios.post(`https://api.rajaongkir.com/starter/cost`, { origin, destination, weight, courier }, {
                headers: {
                    "key": keyy
                },
            })
            res.status(200).send({
                message: 'Get Success!',
                data: data.data.rajaongkir
            })
        } catch (error) {
            // console.log(error.message);
            res.status(400).send({
                message: error.message,
            })
        }
    }
}