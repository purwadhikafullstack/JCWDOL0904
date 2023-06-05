import React from 'react'
import { useState, useEffect } from 'react'
import { CheckIcon, StarIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom'
import { api } from '../API/api'



const Test = () => {

    const navigation = useNavigate();
    const [products, setProduct] = useState([]);

    useEffect(() => {
        const idProduct = localStorage.getItem('idProduct');
        if (idProduct && parseInt(idProduct) > 1) {
            getOneProduct(JSON.parse(idProduct));
        } else {
            navigation('/home');
        }
    }, []);

    const getOneProduct = async (idP) => {
        try {
            const result = await api.post('/product/detail', {
                idP,
            });
            setProduct(result.data.productById);
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };


    // let product = null


    const product = products && {
        name: `${products.product_name}`,
        href: '#',
        price: `${products.price}`,
        description:
            `${products.description}`,
        imageSrc: `http://localhost:8000/${products.product_image}`,
        imageAlt: `${products.product_image}`,
        breadcrumbs: [
            { id: 1, name: 'Travel', href: '#' },
            { id: 2, name: 'Bags', href: '#' },
        ],
        sizes: [
            { name: '18L', description: 'Perfect for a reasonable amount of snacks.' },
            { name: '20L', description: 'Enough room for a serious amount of snacks.' },
        ],
    }

    // const product = {
    //     name: 'Everyday Ruck Snack',
    //     href: '#',
    //     price: '$220',
    //     description:
    //       "Don't compromise on snack-carrying capacity with this lightweight and spacious bag. The drawstring top keeps all your favorite chips, crisps, fries, biscuits, crackers, and cookies secure.",
    //     imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-04-featured-product-shot.jpg',
    //     imageAlt: 'Model wearing light green backpack with black canvas straps and front zipper pouch.',
    //     breadcrumbs: [
    //       { id: 1, name: 'Travel', href: '#' },
    //       { id: 2, name: 'Bags', href: '#' },
    //     ],
    //     sizes: [
    //       { name: '18L', description: 'Perfect for a reasonable amount of snacks.' },
    //       { name: '20L', description: 'Enough room for a serious amount of snacks.' },
    //     ],
    //   }


    const reviews = { average: 4, totalCount: 1624 }

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }



    return (
        <div>
            <div className="bg-white" style={{minHeight:'100vh'}}>
                <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                    {/* Product details */}
                    <div className="lg:max-w-lg lg:self-end">
                        

                        <div className="mt-4">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
                        </div>

                        <section aria-labelledby="information-heading" className="mt-4">
                            <h2 id="information-heading" className="sr-only">
                                Product information
                            </h2>

                            <div className="flex items-center">
                                <p className="text-lg text-gray-900 sm:text-xl">{product.price}</p>

                                <div className="ml-4 border-l border-gray-300 pl-4">
                                    <h2 className="sr-only">Reviews</h2>
                                    <div className="flex items-center">
                                        <div>
                                            <div className="flex items-center">
                                                {[0, 1, 2, 3, 4].map((rating) => (
                                                    <StarIcon
                                                        key={rating}
                                                        className={classNames(
                                                            reviews.average > rating ? 'text-yellow-400' : 'text-gray-300',
                                                            'h-5 w-5 flex-shrink-0'
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                ))}
                                            </div>
                                            <p className="sr-only">{reviews.average} out of 5 stars</p>
                                        </div>
                                        <p className="ml-2 text-sm text-gray-500">{reviews.totalCount} reviews</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-6">
                                <p className="text-base text-gray-500">{product.description}</p>
                            </div>

                            <div className="mt-6 flex items-center">
                                <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
                                <p className="ml-2 text-sm text-gray-500">In stock and ready to ship</p>
                            </div>
                        </section>
                    </div>

                    {/* Product image */}
                    <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
                        <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg">
                            <img src={product.imageSrc} alt={product.imageAlt} className="h-full w-full object-cover object-center" />
                        </div>
                    </div>

                    {/* Product form */}
                    <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
                        <section aria-labelledby="options-heading">
                            <h2 id="options-heading" className="sr-only">
                                Product options
                            </h2>

                            <form>
                                <div className="sm:flex sm:justify-between">
                                    {/* Size selector */}
                                </div>
                                <div className="mt-10">
                                    <button
                                        type="submit"
                                        className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                    >
                                        Add to bag
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Test
