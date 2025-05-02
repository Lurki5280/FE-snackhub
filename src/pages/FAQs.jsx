import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Làm thế nào để đặt hàng trên SnackHub?',
      answer: 'Để đặt hàng trên SnackHub, bạn chỉ cần làm theo các bước sau:\n1. Chọn sản phẩm bạn muốn mua và thêm vào giỏ hàng\n2. Kiểm tra giỏ hàng và số lượng sản phẩm\n3. Nhấn "Thanh toán" và điền thông tin giao hàng\n4. Chọn phương thức thanh toán\n5. Xác nhận đơn hàng'
    },
    {
      question: 'Các phương thức thanh toán được chấp nhận?',
      answer: 'SnackHub chấp nhận nhiều phương thức thanh toán khác nhau:\n- Thanh toán khi nhận hàng (COD)\n- Chuyển khoản ngân hàng\n- Ví điện tử (MoMo, ZaloPay)\n- Thẻ tín dụng/ghi nợ'
    },
    {
      question: 'Thời gian giao hàng là bao lâu?',
      answer: 'Thời gian giao hàng phụ thuộc vào khu vực của bạn:\n- Nội thành: 1-2 ngày\n- Ngoại thành: 2-3 ngày\n- Tỉnh thành khác: 3-5 ngày\nLưu ý: Thời gian có thể thay đổi tùy theo điều kiện thời tiết và tình trạng giao thông.'
    },
    {
      question: 'Chính sách đổi trả như thế nào?',
      answer: 'SnackHub có chính sách đổi trả linh hoạt trong vòng 7 ngày:\n- Sản phẩm còn nguyên bao bì\n- Sản phẩm chưa qua sử dụng\n- Có hóa đơn mua hàng\nTrường hợp sản phẩm bị lỗi, hư hỏng do vận chuyển, chúng tôi sẽ hoàn tiền hoặc gửi sản phẩm thay thế.'
    },
    {
      question: 'Làm sao để theo dõi đơn hàng?',
      answer: 'Bạn có thể theo dõi đơn hàng bằng các cách sau:\n1. Đăng nhập vào tài khoản và vào mục "Đơn hàng của tôi"\n2. Kiểm tra email xác nhận đơn hàng\n3. Liên hệ với bộ phận CSKH qua hotline hoặc chat trực tuyến'
    },
    {
      question: 'Có mức đơn hàng tối thiểu không?',
      answer: 'Không, SnackHub không yêu cầu mức đơn hàng tối thiểu. Tuy nhiên, để được miễn phí vận chuyển, đơn hàng của bạn cần đạt các mức sau:\n- Nội thành: 200.000đ\n- Ngoại thành: 300.000đ\n- Tỉnh thành khác: 500.000đ'
    },
    {
      question: 'Làm sao để nhận mã giảm giá?',
      answer: 'Bạn có thể nhận mã giảm giá từ SnackHub qua nhiều cách:\n- Đăng ký nhận thông báo qua email\n- Theo dõi fanpage Facebook của SnackHub\n- Tham gia chương trình khách hàng thân thiết\n- Nhận mã trong các dịp lễ, sự kiện đặc biệt'
    },
    {
      question: 'Sản phẩm có được bảo quản đúng cách không?',
      answer: 'SnackHub cam kết về chất lượng bảo quản sản phẩm:\n- Kho bãi được kiểm soát nhiệt độ 24/7\n- Đóng gói cẩn thận, chống ẩm\n- Kiểm tra hạn sử dụng thường xuyên\n- Vận chuyển trong điều kiện tối ưu'
    }
  ];

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Câu hỏi thường gặp
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleAnswer(index)}
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <FaChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <FaChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  {faq.answer.split('\\n').map((line, i) => (
                    <p key={i} className="text-gray-600 mt-2">
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs; 