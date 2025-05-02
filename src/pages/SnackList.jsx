import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSnackByCategoryId } from "../api/categories";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation,Pagination} from "swiper/modules";
import Spinner from "../components/Spinner";

const SnackList = ({ categoryId }) => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", categoryId],
    queryFn: () => getSnackByCategoryId(categoryId),
    staleTime: 300000,
    cacheTime: 600000,
  });
  const sliderRef = useRef(null);
  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <Swiper
          ref={sliderRef}
          spaceBetween={20}
          navigation={true}
          loop={true}
          modules={[Navigation]}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="arr-custom"
        >
          {products.map((product) => (
            <SwiperSlide
              key={product._id}
              className="relative w-full h-auto rounded-md p-4 shadow hover:bg-neutral-200 hover:shadow-xl"
            >
              <Link to={`/product/${product._id}`}>
                {product.discount > 0 && (
                  <span className="absolute top-3 right-3 m-2 text-sm bg-red-500 text-white px-2 py-2 rounded-full text-center">
                    {product.discount}%<br />GIẢM
                  </span>
                )}
                <img
                  src={
                    product.images?.[0]?.startsWith("http")
                      ? product.images[0]
                      : "/fallback.png"
                  }
                  alt={product.snackName}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />

                <h3 className="text-center text-lg font-semibold font-sans text-gray-900">
                  {product.snackName}
                </h3>

                <div className="flex flex-col items-center mt-2">
                <p className="text-red-500 text-sm font-bold">
                    {(
                    product.price * (1 - product.discount / 100)
                    ).toLocaleString('vi-VN')}đ
                </p>
                    {product.discount > 0 && (
                        <p className="text-gray-400 text-xs line-through">
                        {product.price.toLocaleString('vi-VN')}đ
                        </p>)}
                </div>

                <div className="flex justify-center mt-4">
                  <button className="py-2 px-4 bg-[#ff784e] border-2 border-black text-white rounded-md hover:bg-[#cc603e]">
                    Đặt ngay
                  </button>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default SnackList;
