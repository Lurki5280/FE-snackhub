import React from 'react';
import { FaHeart, FaLeaf, FaHandshake, FaStar } from 'react-icons/fa';

const About = () => {
  const values = [
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: 'Tận tâm phục vụ',
      description: 'Chúng tôi luôn đặt sự hài lòng của khách hàng lên hàng đầu, mang đến trải nghiệm mua sắm tốt nhất.'
    },
    {
      icon: <FaLeaf className="w-8 h-8" />,
      title: 'Chất lượng sản phẩm',
      description: 'Cam kết cung cấp các sản phẩm chất lượng cao, đảm bảo vệ sinh an toàn thực phẩm.'
    },
    {
      icon: <FaHandshake className="w-8 h-8" />,
      title: 'Đối tác tin cậy',
      description: 'Xây dựng mối quan hệ bền vững với khách hàng và đối tác dựa trên sự tin tưởng và minh bạch.'
    },
    {
      icon: <FaStar className="w-8 h-8" />,
      title: 'Đổi mới sáng tạo',
      description: 'Không ngừng cải tiến và phát triển để mang đến những sản phẩm và dịch vụ tốt nhất.'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Khởi đầu hành trình',
      description: 'SnackHub được thành lập với tầm nhìn trở thành điểm đến tin cậy cho các sản phẩm ăn vặt chất lượng.'
    },
    {
      year: '2021',
      title: 'Mở rộng thị trường',
      description: 'Phát triển mạng lưới phân phối toàn quốc và ra mắt nền tảng thương mại điện tử.'
    },
    {
      year: '2022',
      title: 'Đổi mới công nghệ',
      description: 'Áp dụng công nghệ hiện đại trong quản lý và vận hành, nâng cao trải nghiệm khách hàng.'
    },
    {
      year: '2023',
      title: 'Phát triển bền vững',
      description: 'Đạt được nhiều giải thưởng và chứng nhận về chất lượng sản phẩm và dịch vụ.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">Về SnackHub</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Chúng tôi là điểm đến tin cậy cho những người yêu thích ẩm thực, 
              mang đến những sản phẩm chất lượng và trải nghiệm mua sắm tuyệt vời.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sứ mệnh</h2>
            <p className="text-gray-600">
              Mang đến cho khách hàng những sản phẩm ăn vặt chất lượng cao, 
              đảm bảo an toàn vệ sinh thực phẩm, với giá cả hợp lý và dịch vụ 
              chuyên nghiệp.
            </p>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tầm nhìn</h2>
            <p className="text-gray-600">
              Trở thành thương hiệu hàng đầu trong lĩnh vực cung cấp đồ ăn vặt 
              tại Việt Nam, được khách hàng tin tưởng và lựa chọn.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Giá trị cốt lõi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center text-orange-500 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Chặng đường phát triển
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {milestones.map((milestone, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-orange-500 text-2xl font-bold mb-2">
                {milestone.year}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {milestone.title}
              </h3>
              <p className="text-gray-600">{milestone.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trở thành đối tác của chúng tôi
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Chúng tôi luôn tìm kiếm cơ hội hợp tác với các đối tác chia sẻ 
            cùng tầm nhìn và giá trị.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
          >
            Liên hệ ngay
          </a>
        </div>
      </div>
    </div>
  );
};

export default About; 