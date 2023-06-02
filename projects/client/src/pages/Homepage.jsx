import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Card, CardBody, CardFooter, Button, Divider, Text, Heading, ButtonGroup, Stack, Image } from '@chakra-ui/react'

const Homepage = () => {

    const product = [
        {
            id: 1,
            product_name: "Galaxy S23",
            product_image: "https://images.samsung.com/is/image/samsung/assets/id/2302/pcd/smartphones/PCD_DM1_DM2_KV_Merchandising_376X376_pc.png?$376_376_PNG$",
            price: 7900000,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga nemo iste molestiae voluptatibus iusto praesentium sapiente ullam pariatur quaerat perspiciatis",
            id_category: 1
        },
        {
            id: 2,
            product_name: "Galaxy A34 5G",
            product_image: "https://images.samsung.com/is/image/samsung/p6pim/id/sm-a346ezsexid/gallery/id-galaxy-a34-5g-sm-a346-sm-a346ezsexid-535599554?$1300_1038_PNG$",
            price: 5399000,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga nemo iste molestiae voluptatibus iusto praesentium sapiente ullam pariatur quaerat perspiciatis",
            id_category: 1
        },
        {
            id: 3,
            product_name: "Galaxy A54 5G",
            product_image: "https://images.samsung.com/is/image/samsung/p6pim/id/sm-a546elgdxid/gallery/id-galaxy-a54-5g-sm-a546-sm-a546elgdxid-535684162?$1300_1038_PNG$",
            price: 7900000,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga nemo iste molestiae voluptatibus iusto praesentium sapiente ullam pariatur quaerat perspiciatis",
            id_category: 1
        },
    ]

    const productHP = product.map((el) => {
        return (
            <div key={el.id}>
                <Card maxW='sm' margin='20px'>
                    <CardBody>
                        <Image
                            src={el.product_image}
                            alt='Green double couch with wooden legs'
                            borderRadius='lg'
                            width='300px'
                            height='250px'
                        />
                        <Stack mt='6' spacing='3'>
                            <Heading size='md'>{el.product_name}</Heading>
                            <Text>
                                {el.description}
                            </Text>
                            <Text color='blue.600' fontSize='2xl'>
                                {el.price}
                            </Text>
                        </Stack>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                        <ButtonGroup spacing='2'>
                            <Button variant='ghost' colorScheme='blue'>
                                Detail
                            </Button>
                        </ButtonGroup>
                    </CardFooter>
                </Card>
            </div>
        )
    })

    return (
        <Stack >
            <Stack paddingLeft='200px' paddingRight='200px' backgroundColor="black">
                <Image src='https://images.samsung.com/is/image/samsung/assets/id/homepage/main-homepage/2023/web-01-hd01-DM-Series-kv-pc-1440x640.jpg?imwidth=1366' />
            </Stack>
            <Tabs >
                <TabList marginLeft='200px' marginRight='200px'>
                    <Tab >Smartphone</Tab>
                    <Tab>Watch</Tab>
                    <Tab>Earphone</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel display='flex' flexDirection="row" justifyContent='center' maxWidth='100%'  marginRight='200px' marginLeft='200px'>
                        {productHP}
                    </TabPanel>
                    <TabPanel display='flex' flexDirection="row" justifyContent='center' maxWidth='100%' marginRight='200px' marginLeft='200px'>
                        {productHP}
                    </TabPanel>
                    <TabPanel display='flex' flexDirection="row" justifyContent='center' maxWidth='100%' marginRight='200px' marginLeft='200px'>
                        {productHP}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Stack>
    )
}

export default Homepage
