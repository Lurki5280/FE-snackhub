import React, { useState,useEffect} from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { HiBars3, HiXMark } from "react-icons/hi2"
import { FaUserCircle } from "react-icons/fa"
import { useSelector, useDispatch } from "react-redux";
import { logout, getSnackPoints } from "../store/reducers/authReducer";
import {ShoppingCartIcon} from "@heroicons/react/24/outline";
import { fetchCart } from "../store/reducers/cartReducer";
import { BiCoin } from "react-icons/bi";
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
    label: "Giỏ hàng",
    icon: "/assets/shopping-cart.png",
    path: "/cart"
  },
  {
    label: "FAQs",
    icon: "/assets/faq.png",
    path: "/faqs"
  },
  {
    label: "Liên hệ",
    icon: "/assets/contact.png",
    path: "/contact"
  },
]

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart.cart);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  useEffect(() => {
    if (user && token) {
      dispatch(fetchCart({ token }));
      dispatch(getSnackPoints());
    }
  }, [user, token, dispatch]);
  const cartItemCount = cart?.items?.length || 0;
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
          <button onClick={() => navigate('/profile')}><h2 className="flex text-sm gap-2 font-bold text-[#ff784e] "><FaUserCircle size={20}/>Tài khoản</h2></button>
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

          <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-8"></div>
          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-blue-600">
            <img src="../assets/Logo.png" alt="SnackHub Logo" className="h-20 object-contain" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/popular"
                className="text font-punch px-8 py-1.5 bg-[#ff784e] text-white rounded-s-xl hover:bg-[#cc603e] transition border-4 border-[#3F3F3F]"
              >
                Khám phá
              </Link>
            </div>
            {user && (
              <>
                <div className="hidden md:flex items-center bg-yellow-100 rounded-full px-3 py-1 text-yellow-700">
                  <BiCoin className="text-yellow-500 mr-1" size={18} />
                  <span className="font-medium">{user.snackPoints?.toLocaleString('vi-VN') || 0}</span>
                </div>
                <Link to="/cart" className="relative">
                  <ShoppingCartIcon className="h-7 w-7" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <FaUserCircle className="text-[#ff784e] text-3xl" />
                {user && <span className="hidden md:block text-sm font-medium">{user.firstName}</span>}
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Hồ sơ
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
