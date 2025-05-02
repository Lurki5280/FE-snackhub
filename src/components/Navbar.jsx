          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'
              }
            >
              Trang chủ
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'
              }
            >
              Sản phẩm
            </NavLink>
            <NavLink
              to="/faqs"
              className={({ isActive }) =>
                isActive ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'
              }
            >
              FAQs
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'
              }
            >
              Liên hệ
            </NavLink>
          </div> 