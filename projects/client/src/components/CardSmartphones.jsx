import {  Card, CardBody, Divider, Text, Heading, Stack, Image, Flex } from '@chakra-ui/react'
import axios from 'axios'
import ReactPaginate from "react-paginate"
import React, { useEffect, useState } from 'react'
import { api } from '../API/api'
import { useNavigate } from 'react-router-dom'



const CardSmartphones = () => {

    const navigation = useNavigate()
    const [smartphones, setSmartphones] = useState([])
    const [currentItems, setCurrentItems] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 9

    useEffect(() => {

        getAllproducts()

    }, [])

    const getAllproducts = async () => {
        await api.get(`/product/all`)
            .then((result) => { setSmartphones(result.data.smartphone) }).catch((err) => { console.log(err); });
    }

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(smartphones.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(smartphones.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, smartphones])

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % smartphones.length;
        setItemOffset(newOffset);
    };

    const handleToDetail = (value) => {

        // console.log(value);
        localStorage.setItem("idProduct", JSON.stringify(value))
        navigation("/detail")

    }

    return (
        <div>
            <Flex wrap="wrap" display="flex" justifyContent="center">
                {currentItems.map((el) => {
                    return (
                        <div key={el.id} style={{ width: '350px' }} onClick={() => handleToDetail(el.id)}> 
                            <Card maxW='sm' margin='20px' cursor="pointer" height="500px">
                                <CardBody>
                                    <Image
                                        src={`http://localhost:8000/${el.product_image}`}
                                        alt='Green double couch with wooden legs'
                                        borderRadius='lg'
                                        width='300px'
                                        height='250px'
                                    />
                                    <Stack mt='6' spacing='3'>
                                        <Heading size='md'>{el.product_name}</Heading>
                                        <Text noOfLines={2}
                                            overflow="hidden"
                                            textOverflow="ellipsis"
                                        >
                                            {el.description}
                                        </Text>
                                        <Text color='blue.600' fontSize='2xl'>
                                            Price: Rp.{el.price}
                                        </Text>
                                    </Stack>
                                </CardBody>
                                <Divider />
                            </Card>
                        </div>
                    )
                })}

            </Flex>
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                containerClassName='pagination'
                pageLinkClassName='page-num'
                previousLinkClassName='page-num'
                nextLinkClassName='page-num'
                activeLinkClassName='active'
            />
        </div>
    )
}

export default CardSmartphones
