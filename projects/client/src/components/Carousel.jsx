import Slider from 'react-slick';
import { useState } from 'react';
import { Box, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './css/style.css';

export default function Carousel() {
 const cards = [
    "https://images.samsung.com/is/image/samsung/assets/id/homepage/main-homepage/2023/web-01-hd01-DM-Series-kv-pc-1440x640.jpg?imwidth=1366",
  'https://images.samsung.com/is/image/samsung/assets/id/homepage/pcd/mobile/2023/Galaxy_A_PCD_A-series-banner_PC.jpg?$1440_640_JPG$',
  'https://images.samsung.com/is/image/samsung/assets/id/2302/pcd/smartphones/PCD_Ecosystem_KV_Curation-KV_1440x640_pc.jpg?$1440_640_JPG$'
 ];

 const settings = {
  // fade: true,
  dots: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 50000,
  slidesToShow: 1,
  slidesToScroll: 1
 };

 return (
  <Box className="carousel" maxW="100%" paddingTop="80px">
   {/* Slider */}
   <Slider {...settings}>
    {cards.map((url, index) => (
     <Box
      key={index}
      className="carousel-card"
      position="relative"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      h="280px"
      backgroundImage={`url('${url}')`}
     />
    ))}
   </Slider>
  </Box>
 );
}
