import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const bannerImages = [
  "../assets/ads/banner1.jpg",
  "../assets/ads/banner2.jpeg",
  "../assets/ads/banner3.png",
];

const BannerSlider = () => {
  return (
    <div className="w-full max-w-screen-xl mx-auto mt-6 rounded-xl overflow-hidden shadow-lg">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        navigation
        className="mySwiper"
      >
        {bannerImages.map((src, index) => (
          <SwiperSlide key={index}>
            <img src={src} alt={`Banner ${index + 1}`} className="w-20 h-auto object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
