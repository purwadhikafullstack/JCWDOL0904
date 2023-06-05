import React, { useEffect, useState } from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Card, CardBody, CardFooter, Button, Divider, Text, Heading, ButtonGroup, Stack, Image, Flex } from '@chakra-ui/react'
import CardSmartphones from '../components/CardSmartphones'
import CardWatchs from '../components/CardWatchs'
import CardEarphones from '../components/CardEarphones'

const Homepage = () => {

    return (
        <div style={{ minHeight: '150vh' }}>
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
                    <TabPanel display='flex' flexDirection="column" justifyContent='center' maxWidth='100%' marginRight='200px' marginLeft='200px'>
                        <CardSmartphones />
                    </TabPanel>
                    <TabPanel display='flex' flexDirection="row" justifyContent='center' maxWidth='100%' marginRight='200px' marginLeft='200px'>
                        <CardWatchs />
                    </TabPanel>
                    <TabPanel display='flex' flexDirection="row" justifyContent='center' maxWidth='100%' marginRight='200px' marginLeft='200px'>
                        <CardEarphones />
                    </TabPanel>
                </TabPanels>
            </Tabs>

        </div>
    )
}

export default Homepage
