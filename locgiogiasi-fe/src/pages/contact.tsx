import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import api from "@/utils/api";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState<null | "success" | "error" | "loading">(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }
    try {
      setSent("loading");
      await api.post("/contacts", form);
      setSent("success");
      toast.success("Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error("Contact form failed", error);
      setSent("error");
      toast.error("Gửi tin nhắn thất bại. Vui lòng thử lại.");
    } finally {
      setTimeout(() => setSent(null), 4000);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Hotline",
      content: "0123.456.789",
      detail: "Hỗ trợ 8:00 - 17:00"
    },
    {
      icon: Mail,
      title: "Email",
      content: "contact@locgiogiasi.vn",
      detail: "Phản hồi trong 24h"
    },
    {
      icon: MapPin,
      title: "Địa chỉ",
      content: "123 Đường ABC, Quận XYZ",
      detail: "TP. Hồ Chí Minh"
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      content: "Thứ 2 - Thứ 7",
      detail: "8:00 - 17:00"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-14 mb-10">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="mb-4">
            <img src="/logo.png" alt="Lọc Gió Giá Sỉ" className="h-14 w-auto mx-auto drop-shadow" />
          </div>
          <h1 className="text-4xl font-extrabold text-primary-700 mb-2 text-center tracking-tight">
            Liên hệ với AutoFilter Pro - Lọc gió ô tô chính hãng giá sỉ
          </h1>
          <p className="text-lg text-secondary-700 text-center max-w-xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy gửi thông tin hoặc liên hệ trực tiếp qua các kênh bên dưới!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Thông tin liên hệ */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-primary-100 shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-start gap-2 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center mb-2 group-hover:bg-primary-500/20 transition-colors">
                    <item.icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary-700 mb-1">{item.title}</h3>
                  <p className="text-base font-bold text-secondary-900 mb-0.5">{item.content}</p>
                  <p className="text-base text-secondary-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form liên hệ */}
          <div>
            <div className="bg-white rounded-2xl border border-secondary-200/60 shadow-lg p-8">
              <h2 className="text-2xl font-bold text-primary-700 mb-6 text-center">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-base font-semibold text-secondary-900 mb-1.5">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-secondary-200 px-4 py-3 text-base text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-base font-semibold text-secondary-900 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-secondary-200 px-4 py-3 text-base text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-base font-semibold text-secondary-900 mb-1.5">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-secondary-200 px-4 py-3 text-base text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
                      placeholder="0123.456.789"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-base font-semibold text-secondary-900 mb-1.5">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-secondary-200 px-4 py-3 text-base text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
                    placeholder="Chủ đề liên hệ"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-base font-semibold text-secondary-900 mb-1.5">
                    Nội dung tin nhắn
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-secondary-200 px-4 py-3 text-base text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none"
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white rounded-xl py-3 px-6 text-base font-bold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                  disabled={sent === "loading"}
                >
                  <Send className="w-5 h-5" />
                  {sent === "loading" ? "Đang gửi..." : "Gửi tin nhắn"}
                </button>
                {sent === "success" && (
                  <div className="mt-2 text-green-600 text-center font-medium animate-fade-in">
                    ✅ Gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.
                  </div>
                )}
                {sent === "error" && (
                  <div className="mt-2 text-red-600 text-center font-medium animate-fade-in">
                    ❌ Gửi thất bại. Vui lòng thử lại sau.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bản đồ */}
        <div className="mt-14">
          <h3 className="text-xl font-bold text-primary-700 mb-4 text-center">Địa chỉ cửa hàng</h3>
          <div className="rounded-2xl border border-secondary-200/60 shadow aspect-[4/2] overflow-hidden bg-secondary-50">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197006!2d106.69141847465353!3d10.777669289362096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a9d8d1bb3%3A0xc4eca1b17d27fc49!2zMTIzIMSQxrDhu51uZyBBQkMsIFF14bqtbiBYWVosIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1647327429124!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 