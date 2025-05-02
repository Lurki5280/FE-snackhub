import React from 'react';
import { FaTruck, FaClock, FaMoneyBillWave, FaMapMarkedAlt } from 'react-icons/fa';

const Shipping = () => {
  const shippingPolicies = [
    {
      icon: <FaTruck className="w-8 h-8" />,
      title: 'Phương thức vận chuyển',
      content: [
        'Giao hàng trực tiếp thông qua đội ngũ SnackHub',
        'Giao hàng qua các đơn vị vận chuyển đối tác',
        'Đảm bảo an toàn và bảo quản chất lượng sản phẩm'
      ]
    },
    {
      icon: <FaClock className="w-8 h-8" />,
      title: 'Thời gian giao hàng',
      content: [
        'Nội thành TP.HCM: 1-2 ngày',
        'Ngoại thành TP.HCM: 2-3 ngày',
        'Các tỉnh thành khác: Snackhub chưa có mặt ở các tỉnh thành khác',
      ]
    },
    {
      icon: <FaMoneyBillWave className="w-8 h-8" />,
      title: 'Phí giao hàng',
      content: [
        'Miễn phí giao hàng cho đơn từ 200.000đ (nội thành)',
        'Miễn phí giao hàng cho đơn từ 500.000đ (toàn quốc)',
        'Phí giao hàng tiêu chuẩn: 15.000đ - 30.000đ',
      ]
    },
    {
      icon: <FaMapMarkedAlt className="w-8 h-8" />,
      title: 'Khu vực giao hàng',
      content: [
        'Giao hàng toàn quốc',
        'Ưu tiên khu vực TP.HCM và các tỉnh lân cận',
        'Một số khu vực đặc biệt có thể phát sinh phí vận chuyển'
      ]
    }
  ];

  const additionalPolicies = [
    {
      title: 'Chính sách đổi trả',
      content: 'Quý khách có thể yêu cầu đổi/trả hàng trong vòng 24h nếu sản phẩm không đúng hoặc bị hư hỏng trong quá trình vận chuyển.'
    },
    {
      title: 'Đóng gói sản phẩm',
      content: 'Sản phẩm được đóng gói cẩn thận, đảm bảo vệ sinh an toàn thực phẩm và nguyên vẹn khi giao đến tay khách hàng.'
    },
    {
      title: 'Theo dõi đơn hàng',
      content: 'Khách hàng có thể theo dõi trạng thái đơn hàng thông qua tin nhắn SMS hoặc trực tiếp trên website.'
    },
    {
      title: 'Hỗ trợ khách hàng',
      content: 'Đội ngũ CSKH luôn sẵn sàng hỗ trợ các vấn đề về giao hàng qua hotline 1900 1008 (8h-22h hàng ngày).'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Chính sách giao hàng
          </h1>
          <p className="text-lg text-gray-600">
            Cam kết giao hàng nhanh chóng, an toàn và tiện lợi
          </p>
        </div>

        {/* Main Shipping Policies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {shippingPolicies.map((policy, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4 text-orange-500">
                {policy.icon}
                <h2 className="text-xl font-semibold text-gray-900 ml-3">
                  {policy.title}
                </h2>
              </div>
              <ul className="space-y-2">
                {policy.content.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Policies */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Thông tin thêm
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {additionalPolicies.map((policy, index) => (
              <div key={index} className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {policy.title}
                </h3>
                <p className="text-gray-600">{policy.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center bg-orange-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Cần hỗ trợ thêm?
          </h2>
          <p className="text-gray-600 mb-6">
            Liên hệ với chúng tôi qua hotline hoặc email để được hỗ trợ nhanh nhất
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="tel:19001008"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              Gọi ngay 1900 1008
            </a>
            <a
              href="mailto:support@snackhub.com"
              className="inline-flex items-center px-6 py-3 border border-orange-600 text-base font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50"
            >
              Gửi email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping; 