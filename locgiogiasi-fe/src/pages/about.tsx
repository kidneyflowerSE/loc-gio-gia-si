import React from 'react';
import { MessageCircle, Search, Star, CheckCircle, Leaf, Shield, Award } from 'lucide-react';

export default function AboutPage() {
  const whyChooseUs = [
    {
      icon: Shield,
      title: "Chất lượng lọc vượt chuẩn",
      text: "AutoFilter Pro sử dụng vật liệu lọc cao cấp, giúp loại bỏ bụi mịn, phấn hoa, vi khuẩn và mùi hôi hiệu quả. Mỗi sản phẩm đều được kiểm tra kỹ lưỡng trước khi đến tay khách hàng.",
    },
    {
      icon: Leaf,
      title: "Phù hợp chuẩn từng dòng xe",
      text: "Chúng tôi cung cấp đa dạng mã lọc theo từng đời xe, bảo đảm vừa khít và hoạt động ổn định. Dù bạn đi sedan, SUV hay bán tải, AutoFilter Pro đều có giải pháp chính xác.",
    },
    {
      icon: Award,
      title: "Tư vấn đúng, phục vụ tận tâm",
      text: "Với nền tảng hơn 10 năm trong ngành phụ tùng ô tô, chúng tôi hiểu rõ nhu cầu và thói quen sử dụng của khách hàng. AutoFilter Pro cam kết giao đúng hàng, hỗ trợ kỹ thuật tận nơi, đồng hành dài lâu cùng gara và tài xế cá nhân.",
    },
  ];

  const features = [
    { icon: CheckCircle, text: "Chặn bụi mịn, kháng khuẩn, khử mùi hiệu quả" },
    { icon: Leaf, text: "Thân thiện với môi trường" },
    { icon: Shield, text: "Bảo vệ sức khỏe gia đình" },
    { icon: Award, text: "Được nhiều gara tin dùng" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-500 via-green-600 to-green-700 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <div className="inline-block bg-white text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
                  Hơn 10 năm kinh nghiệm
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  AutoFilter Pro
                </h1>
                <p className="text-xl lg:text-2xl text-green-100 font-medium">
                  Chọn lọc vì sức khỏe, phục vụ bằng uy tín
                </p>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-green-50 leading-relaxed">
                  Thương hiệu chuyên cung cấp lọc điều hòa ô tô chất lượng cao, 
                  bảo vệ sức khỏe và mang lại không khí trong lành cho mỗi hành trình của bạn.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <feature.icon className="w-5 h-5 text-green-300 flex-shrink-0" />
                      <span className="text-sm text-green-50">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-green-600 rounded-3xl blur opacity-30"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-2xl max-w-md">
                  <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Leaf className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-sm font-medium">Lọc gió điều hòa<br />AutoFilter Pro</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Về Chúng Tôi</h2>
              <div className="w-24 h-1 bg-green-500 mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 leading-relaxed">
                AutoFilter Pro được phát triển từ hơn 10 năm kinh nghiệm thực tế trong ngành phụ tùng ô tô
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-2xl border-l-4 border-green-500">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Sứ mệnh của chúng tôi</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Chúng tôi hiểu rằng không khí trong lành trong cabin xe không chỉ là sự thoải mái – 
                    mà còn là yếu tố quan trọng bảo vệ sức khỏe của bạn và gia đình trên mỗi hành trình.
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-2xl border-l-4 border-green-500">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Cam kết chất lượng</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Cam kết của chúng tôi là mang đến sản phẩm "lọc đúng – lọc sạch – lọc bền", 
                    giúp điều hòa xe bạn hoạt động tối ưu trong mọi điều kiện.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-4">Tại AutoFilter Pro</h3>
                  <h4 className="text-lg font-semibold mb-4">Chúng tôi tập trung vào:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-200 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold">Chất lượng lọc vượt trội:</span>
                        <span className="text-green-100"> Chặn bụi mịn, kháng khuẩn, khử mùi hiệu quả</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-200 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold">Phù hợp chính xác từng dòng xe:</span>
                        <span className="text-green-100"> Tư vấn đúng, giao hàng nhanh</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-200 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold">Dịch vụ tận tâm:</span>
                        <span className="text-green-100"> Được nhiều gara, kỹ thuật viên và khách hàng cá nhân tin dùng</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tại Sao Chọn AutoFilter Pro?</h2>
            <div className="w-24 h-1 bg-green-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi không chỉ bán sản phẩm, chúng tôi mang đến giải pháp và sự an tâm cho hành trình của bạn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {whyChooseUs.map((reason, index) => (
              <div key={reason.title} className="group">
                <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-sm h-full hover:scale-105 transition-all duration-300">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <reason.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{reason.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-center">{reason.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}