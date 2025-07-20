import Head from "next/head";
import Image from "next/image";
import { Check, MessageCircle, Search, Star } from "lucide-react";

export default function AboutPage() {
  const expert = {
    name: "Hoài Thanh",
    businessName: "Lọc Gió Giá Sỉ",
    title: "Chủ doanh nghiệp",
    avatar: "/logo.png", // Thay bằng ảnh chân dung chuyên nghiệp
    headline: "Cung cấp lọc gió chất lượng cao, được tuyển chọn bởi chuyên gia.",
    bio: "Với kinh nghiệm nhiều năm trong ngành phụ tùng ô tô, tôi thành lập Lọc Gió Giá Sỉ với mục tiêu đơn giản: giúp bạn dễ dàng tiếp cận những sản phẩm tốt nhất với giá gốc, đi kèm sự tư vấn trung thực và tận tâm.",
  };

  const whyChooseMe = [
    {
      icon: Search,
      title: "Sản Phẩm Tuyển Chọn",
      text: "Mỗi sản phẩm đều được tôi nghiên cứu và kiểm tra kỹ lưỡng, đảm bảo tương thích và hoạt động hiệu quả.",
    },
    {
      icon: MessageCircle,
      title: "Tư Vấn Chuyên Sâu",
      text: "Bạn sẽ nhận được lời khuyên từ kinh nghiệm thực tế, không chỉ là thông số kỹ thuật khô khan.",
    },
    {
      icon: Star,
      title: "Cam Kết Chất Lượng",
      text: "Tôi đứng sau mỗi sản phẩm bán ra. Sự hài lòng và an toàn của bạn là ưu tiên hàng đầu của tôi.",
    },
  ];

  const qna = [
    {
      question: "Làm sao tôi biết lọc gió này phù hợp với xe của mình?",
      answer: "Hãy cung cấp cho tôi thông tin về dòng xe và đời xe của bạn. Tôi sẽ giúp bạn kiểm tra và tìm ra sản phẩm chính xác nhất."
    },
    {
      question: "Chính sách đổi trả như thế nào?",
      answer: "Nếu sản phẩm có lỗi từ nhà sản xuất hoặc không đúng như tư vấn, tôi hỗ trợ đổi trả trong vòng 7 ngày."
    }
  ];

  return (
    <>
      <Head>
        <title>Về Chuyên Gia | {expert.businessName}</title>
      </Head>

      <div className="bg-white text-secondary-800 font-sans">
        {/* HERO */}
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div className="space-y-6">
              <p className="font-semibold text-primary-600 tracking-wide uppercase">{expert.title}</p>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-secondary-900">{expert.name}</h1>
              <p className="text-xl text-secondary-600 leading-relaxed">{expert.bio}</p>
            </div>
            {/* Right - Image */}
            <div className="relative w-full aspect-square max-w-md mx-auto lg:max-w-none">
              <div className="absolute inset-0 bg-secondary-100 rounded-full -rotate-12"></div>
              <Image
                src={expert.avatar}
                alt={expert.name}
                fill
                className="object-cover rounded-full"
              />
            </div>
          </div>
        </div>
        
        {/* WHY CHOOSE ME */}
        <div className="bg-secondary-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-12">Tại Sao Chọn AutoFilter Pro ?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {whyChooseMe.map(reason => (
                <div key={reason.title} className="p-8">
                  <div className="w-16 h-16 flex items-center justify-center bg-primary-500 text-white rounded-full mx-auto mb-6">
                    <reason.icon className="w-8 h-8"/>
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-3">{reason.title}</h3>
                  <p className="text-secondary-600">{reason.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* CTA */}
        <div className="bg-secondary-900">
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Sẵn Sàng Tìm Sản Phẩm Phù Hợp?</h2>
                <p className="text-secondary-300 mb-8 max-w-xl mx-auto">
                    Duyệt qua danh mục sản phẩm hoặc liên hệ trực tiếp với tôi để được tư vấn.
                </p>
                <div className="flex justify-center gap-4">
                     <a href="/products" className="bg-primary-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors">
                        Xem Sản Phẩm
                    </a>
                    <a href="/contact" className="bg-white/10 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/20 transition-colors">
                        Liên Hệ
                    </a>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}