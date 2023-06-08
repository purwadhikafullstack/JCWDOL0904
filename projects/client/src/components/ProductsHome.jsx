import { Card, CardBody, Divider, Text, Heading, Stack, Image, Flex} from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import "../pages/style/Homepage.css"


const ProductsHome = ({ products}) => {

    const navigation = useNavigate()
    const handleToDetail = (value) => {
        localStorage.setItem("idProduct", JSON.stringify(value))
        navigation("/detail")
    }

    return (
        <div style={{display:'flex', flexDirection:'column', alignItems:"center"}}>
            <Flex wrap="wrap" display="flex" justifyContent="center">
                {products?.map((el) => {
                    return (
                        <div key={el.id} onClick={() => handleToDetail(el.id)} className='con-cards'>
                            <Card cursor="pointer" width="200px" height="300px">
                                <CardBody >
                                    <Image
                                        src={`${el.product_image}`}
                                        alt='Green double couch with wooden legs'
                                        borderRadius='lg'
                                        width='150px'
                                        height='150px'
                                    />
                                    <Stack mt='6' spacing='3'>
                                        <Heading fontSize="10px">{el.product_name}</Heading>
                                        <Text noOfLines={2}
                                            overflow="hidden"
                                            textOverflow="ellipsis"
                                            fontSize="10px"
                                        >
                                            {el.description}
                                        </Text>
                                        <Text fontSize='sm'>
                                            Price: Rp.{el.price.toLocaleString("id-ID")}
                                        </Text>
                                    </Stack>
                                </CardBody>
                                <Divider />
                            </Card>
                        </div>
                    )
                })}

            </Flex>
            
        </div>
    )
}

export default ProductsHome
