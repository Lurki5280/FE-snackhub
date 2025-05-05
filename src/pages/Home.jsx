import React from "react"
import { useEffect, useState} from "react"
import { Link } from "react-router-dom"
import AdsLogo from "../components/AdsLogo"
import PromoTicker from "../components/Banner"
import { getAllCategories } from "../api/categories"
import Spinner from "../components/Spinner"
import SnackList from "./SnackList"
import BannerSlider from "../components/AdBanner"
function Home() {
  const [snacks, setSnacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await getAllCategories(); 
      setCategories(response);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const handleResize = () => {
      if (sliderRef.current && sliderRef.current.swiper) {
        sliderRef.current.swiper.update();
      }
    };
    loadCategories();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section>
    <div
  className="relative w-full bg-cover bg-center text-white py-24 px-6 md:px-12 rounded-xl shadow-lg"
  style={{ backgroundImage: "url('/assets/ads/banner1.jpg')" }}
>
        <div className="bg-black bg-opacity-50 p-6 rounded-xl max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-punch text-orange-300 leading-tight">
            Vị ngon từng vùng – đến tay mỗi tháng!
          </h1>
          <p className="mt-6 font-punch text-lg text-white">
            Khám phá hương vị Việt Nam từ Bắc chí Nam — cùng hàng ngàn người yêu thích đồ ăn vặt và văn hóa địa phương!
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/popular"
              className="bg-[#ff784e] text-white px-6 py-3 rounded-full hover:bg-[#cc603e] transition border-4 border-[#3F3F3F]"
            >
              Khám phá
            </Link>
            <Link
              to="/subscribe"
              className="bg-red-400 text-black px-6 py-3 rounded-full hover:bg-red-500 transition border-4 border-black"
            >
              Quà tặng
            </Link>
          </div>
        </div>
      </div>

      <AdsLogo></AdsLogo>
      <PromoTicker/>
      <div className="mt-8 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Tất cả sản phẩm</h1>
      {loading ? (
            <Spinner/>
          ) : (
            categories.map((category) => (
              <div key={category.categoryId} className="mb-12">
                <h3 className="text-2xl font-semibold mb-4">{category.categoryName}</h3>
                <SnackList categoryId={category.categoryId} />
              </div>
            ))
          )}
      
    </div>
    </section>
    
  )
}

export default Home
