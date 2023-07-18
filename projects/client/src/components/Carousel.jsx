import Slider from "react-slick";
import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./css/style.css";
import { api } from "../API/api";

export default function Carousel() {
  const [promotionImg, setPromotionImg] = useState(null);
  const [promotionImgSmall, setPromotionImgSmall] = useState(null);
  const [pic, setPic] = useState(null);

  const getAllPromotion = async () => {
    await api
      .get("/promotion")
      .then((result) => {
        setPromotionImg(result.data.wideSc);
        setPromotionImgSmall(result.data.smallSc);
      })
      .catch((err) => {
        Swal.fire({
          title: "error",
          text: "Something went wrong",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "black",
        });
      });
  };

  const updateImageSource = () => {
    const isSmallScreen = window.matchMedia("(max-width: 400px)").matches;

    if (isSmallScreen) {
      setPic(promotionImgSmall);
    } else {
      setPic(promotionImg);
    }
  };

  useEffect(() => {
    getAllPromotion();
  }, []);

  useEffect(() => {
    updateImageSource();
    window.addEventListener("resize", updateImageSource);

    return () => {
      window.removeEventListener("resize", updateImageSource);
    };
  }, [promotionImg, promotionImgSmall]);

  const settings = {
    fade: true,
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Box className="carousel" maxW="100%" paddingTop="65px">
      <Slider {...settings}>
        {pic
          ? pic.map((el, index) => (
              <Box
                key={index}
                className="carousel-card"
                position="relative"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                backgroundSize="cover"
                h="500px"
                backgroundImage={`url('${el.promotion_image}')`}
              />
            ))
          : null}
      </Slider>
    </Box>
  );
}
