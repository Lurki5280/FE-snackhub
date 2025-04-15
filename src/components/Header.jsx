import React, { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { HiBars3, HiXMark } from "react-icons/hi2"
import { FaUserCircle } from "react-icons/fa"
const menuItems = [
  {
    label: "Bán chạy nhất",
    icon: "/assets/get-started.png",
    path: "/popular"
  },
  {
    label: "Đặc sản",
    icon: "/assets/gift.png",
    path: "/gift"
  },
  {
    label: "Bánh kẹo",
    icon: "/assets/snack.png",
    path: "/past-boxes"
  },
  {
    label: "FAQs",
    icon: "/assets/faq.png",
    path: "/faq"
  },
  {
    label: "Liên hệ",
    icon: "/assets/contact.png",
    path: "/contact"
  },
]
function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-md transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
        <Link to="/login"><h2 className="flex text-sm gap-2 font-bold text-[#ff784e] "><FaUserCircle size={20}/>Tài khoản</h2></Link>
          <button onClick={() => setIsOpen(false)}>
            <HiXMark size={24} />
          </button>
        </div>
        <h2 className="text-2xl gap-2 font-bold bg-[#ff784e] text-white p-4">Hộp đăng ký</h2>
        <div className="flex flex-col gap-4 p-4 md:gap-2">
        {menuItems.map((item, idx) => (
          <Link
            to={item.path}
            key={idx}
            className="bg-white w-full rounded-xl shadow p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition "
          >
            <img src={item.icon} alt={item.label} className="w-16 h-16 mb-2" />
            <span className="text-[#ff784e] font-semibold text-lg">{item.label}</span>
          </Link>
        ))}
      </div>
      </div>

      <nav className="relative z-40 bg-white shadow-md py-6">
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
        <button onClick={() => setIsOpen(true)} className="text-gray-700">
          <HiBars3 size={40} />
        </button>

        <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-blue-600">
        <img src="../assets/Logo.png" alt="SnackHub Logo" className="h-20 object-contain" />
        </Link>

        <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/subscribe"
            className="text font-punch px-8 py-1.5 bg-[#ff784e] text-white rounded-s-xl hover:bg-[#cc603e] transition border-4 border-[#3F3F3F]"
          >
            Khám phá
          </Link>
          <Link
            to="/gift"
            className="text font-punch px-8 py-1.5 bg-red-400 text-black rounded-r-xl hover:bg-red-500 transition border-4 border-black"
          >
            Tặng quà
          </Link>
        </div>

        <button onClick={() => navigate("/login")} className="text-gray-700">
          <FaUserCircle size={35} />
        </button>
      </div>

      </div>
    </nav>

    </>
  )
}

export default Header
