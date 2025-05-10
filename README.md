# SnackHub Frontend

Frontend cho hệ thống bán hàng SnackHub, được xây dựng với React và Vite.

## Công nghệ sử dụng

- React 18
- Vite
- Redux Toolkit cho state management
- React Query cho data fetching
- Tailwind CSS cho styling
- Material UI và Flowbite cho UI components
- React Router cho routing
- Axios cho API calls
- React Hot Toast cho notifications
- Framer Motion cho animations
- Swiper cho carousel/slider

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview
```

## Cấu trúc thư mục

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── features/      # Redux slices và features
├── services/      # API services
├── hooks/         # Custom hooks
├── utils/         # Utility functions
├── assets/        # Static assets
└── styles/        # Global styles
```

## Tính năng chính

- Đăng ký/Đăng nhập người dùng
- Xem danh sách sản phẩm với bộ lọc và tìm kiếm
- Giỏ hàng và thanh toán
- Theo dõi đơn hàng
- Đánh giá và bình luận sản phẩm
- Responsive design cho mobile và desktop

## Môi trường phát triển

Tạo file `.env` với các biến môi trường sau:

```
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## Contributing

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Dự án này được phát triển cho mục đích học tập và nghiên cứu. 
