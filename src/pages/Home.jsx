import React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AdsLogo from "../components/AdsLogo"
import {getAllSnacks} from "../api/snacks"
import FeaturedSnacks from "../components/FeaturedSnacks"
import Spinner from "../components/Spinner"
function Home() {
  const [snacks, setSnacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        const data = await getAllSnacks()
        setSnacks(data)
      } catch (error) {
        console.error("Failed to fetch snacks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSnacks()
  }, [])
  return (
    <section className="bg-gradient-to-b from-yellow-50 to-white min-h-screen flex flex-col items-center justify-center text-center">
    <div className="relative max-w-2xl items-center mr-auto p-6 md:m-20">
      <h1 className="text-3xl md:text-4xl font-punch text-orange-600 max-w-2xl leading-tight">
      Vị ngon từng vùng – đến tay mỗi tháng!
      </h1>
      <p className="mt-6 font-punch text-lg text-gray-700 max-w-xl">
      Khám phá hương vị Việt Nam từ Bắc chí Nam — cùng hàng ngàn người yêu thích đồ ăn vặt và văn hóa địa phương!
      </p>
      <Link
        to="/subscribe"
        className="mt-6 inline-block bg-orange-500 text-white px-6 py-3 bg-[#ff784e] rounded-full hover:bg-[#cc603e] transition border-4 border-[#3F3F3F]"
      >
        Khám phá
      </Link>
      <Link
        to="/subscribe"
        className="ml-6 mt-6 inline-block bg-orange-500 text-white px-6 py-3 bg-red-400 text-black rounded-full hover:bg-red-500 transition border-4 border-black"
      >
        Quà tặng
      </Link>
      </div>
      <AdsLogo></AdsLogo>
      <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Sản Phẩm</h1>

      {loading ? (
        <Spinner></Spinner>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {snacks.map((snack) => (
            <Link
            to={`/product/${snack._id}`}
            key={snack._id}
            className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition block"
          >
              <h2 className="text-xl font-semibold">{snack.snackName}</h2>
              <p className="text-sm text-gray-600 mt-2">{snack.description}</p>
              {snack.image && (
                <img src={snack.image} alt={snack.name} className="w-full h-40 object-cover rounded-lg mt-3" />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
    </section>
    
  )
}

export default Home
