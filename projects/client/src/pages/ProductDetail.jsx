import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../API/api'
import { Button, Image, Stack } from '@chakra-ui/react'
import "./style/ProductDetail.css"


const ProductDetail = () => {

    const navigation = useNavigate();
    // const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({})
    const [stock, setStock] = useState(0)

    useEffect(() => {
        const idProduct = localStorage.getItem('idProduct');
        if (idProduct && parseInt(idProduct) > 0) {
            getOneProduct(JSON.parse(idProduct));
        } else {
            navigation("/home")
        }
    }, []);

    const getOneProduct = async (idP) => {
        try {
            const result = await api.post('/product/detail', { idP });
            setStock(result.data.stock)
            setProduct({ name: `${result.data.productById.product_name}`, price: `${result.data.productById.price}`, description: `${result.data.productById.description}`, imageSrc: `${result.data.productById.product_image}`, imageAlt: `${result.data.productById.product_image}`, })
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className='con-product-detail'>
                <div className='wrap-product-detail'>

                    <div className='con-info'>
                        <div>
                            <h1 style={{ padding: '10px', fontSize: '30px', fontWeight: 'bold' }}>{product.name}</h1>
                        </div>
                        <section aria-labelledby="information-heading">

                            <div className="flex items-center">
                                <h1 className="price-detail">Price :</h1>
                                <p className="num-price-detail">Rp.{product.price}</p>
                            </div>

                            <div className="con-desc-text">
                                <p className="desc-text">{product.description} ankdawfbalwbfl balwblabwflbawflaawfabnlwfnalfwbalwbfa fkwa f awbfoabfoia fa wfoa foa o</p>
                            </div>

                            <div className="">
                                <p className="">Product stock is {stock} piece</p>
                            </div>
                        </section>
                        <div className="con-button-add">
                            <Button className="button-add" colorScheme='gray'>
                                Add to cart
                            </Button>
                        </div>
                    </div>
                    <Image src={product.imageSrc} alt={product.imageAlt} className="" />
                </div>
            </div>

        </div>
    )
}

export default ProductDetail
