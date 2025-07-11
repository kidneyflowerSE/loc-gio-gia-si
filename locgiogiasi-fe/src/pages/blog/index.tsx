import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";

// Blog posts data (same as in index.tsx)
const blogPosts = [
  {
    id: 1,
    title: "Tầm quan trọng của việc thay lọc gió định kỳ",
    slug: "tam-quan-trong-cua-viec-thay-loc-gio-dinh-ky",
    excerpt: "Lọc gió là một phần quan trọng trong hệ thống động cơ ô tô. Việc thay thế định kỳ giúp động cơ hoạt động hiệu quả và kéo dài tuổi thọ xe.",
    image: "/loc-gio-dieu-hoa.jpg",
    date: "15/06/2023",
    category: "Bảo dưỡng",
    author: "Kỹ thuật viên Minh",
    content: `
      <p>Lọc gió động cơ là một bộ phận nhỏ nhưng đóng vai trò cực kỳ quan trọng trong việc bảo vệ động cơ xe của bạn. Nó hoạt động như một rào cản, ngăn chặn bụi bẩn, côn trùng và các hạt tạp chất khác xâm nhập vào động cơ.</p>
      
      <h3>Tại sao phải thay lọc gió định kỳ?</h3>
      
      <p>Theo thời gian, lọc gió sẽ bị tắc nghẽn bởi bụi bẩn và các hạt tạp chất. Khi điều này xảy ra, lượng không khí đi vào động cơ sẽ bị giảm, dẫn đến:</p>
      
      <ul>
        <li>Giảm hiệu suất động cơ</li>
        <li>Tăng mức tiêu thụ nhiên liệu</li>
        <li>Tăng khả năng phát thải khí độc hại</li>
        <li>Giảm tuổi thọ động cơ</li>
      </ul>
      
      <h3>Khi nào cần thay lọc gió?</h3>
      
      <p>Các nhà sản xuất ô tô thường khuyến cáo thay lọc gió sau khoảng 15.000 đến 30.000 km, tùy thuộc vào điều kiện lái xe. Tuy nhiên, nếu bạn thường xuyên lái xe trong môi trường nhiều bụi bẩn, có thể cần thay lọc gió sớm hơn.</p>
      
      <h3>Dấu hiệu lọc gió cần thay</h3>
      
      <p>Một số dấu hiệu cho thấy lọc gió của bạn cần được thay thế:</p>
      
      <ul>
        <li>Giảm khả năng tăng tốc</li>
        <li>Động cơ hoạt động không ổn định khi chạy không tải</li>
        <li>Tăng mức tiêu thụ nhiên liệu</li>
        <li>Đèn kiểm tra động cơ bật sáng</li>
        <li>Lọc gió có màu đen hoặc xám thay vì màu trắng hoặc be</li>
      </ul>
      
      <h3>Lợi ích của việc thay lọc gió đúng thời điểm</h3>
      
      <p>Thay lọc gió định kỳ mang lại nhiều lợi ích:</p>
      
      <ul>
        <li>Cải thiện hiệu suất động cơ</li>
        <li>Tiết kiệm nhiên liệu</li>
        <li>Giảm phát thải khí độc hại</li>
        <li>Kéo dài tuổi thọ động cơ</li>
        <li>Giảm chi phí sửa chữa lớn trong tương lai</li>
      </ul>
      
      <p>Việc thay lọc gió là một thao tác bảo dưỡng đơn giản nhưng mang lại hiệu quả cao. Hãy đảm bảo rằng bạn tuân thủ lịch bảo dưỡng được đề xuất để giữ cho xe của bạn hoạt động hiệu quả và bền bỉ.</p>
    `
  },
  {
    id: 2,
    title: "Cách phân biệt lọc gió chính hãng và hàng giả",
    slug: "cach-phan-biet-loc-gio-chinh-hang-va-hang-gia",
    excerpt: "Thị trường phụ tùng ô tô có nhiều sản phẩm kém chất lượng. Bài viết này giúp bạn nhận biết lọc gió chính hãng để tránh mua phải hàng giả.",
    image: "/loc-gio-dieu-hoa.jpg",
    date: "22/07/2023",
    category: "Kiến thức",
    author: "Chuyên gia Hùng",
    content: `
      <p>Thị trường phụ tùng ô tô hiện nay có rất nhiều sản phẩm lọc gió với chất lượng khác nhau. Việc lựa chọn đúng lọc gió chính hãng là rất quan trọng để đảm bảo hiệu suất và tuổi thọ cho động cơ xe của bạn.</p>
      
      <h3>Tại sao cần sử dụng lọc gió chính hãng?</h3>
      
      <p>Lọc gió chính hãng được thiết kế đặc biệt phù hợp với từng loại động cơ, đảm bảo khả năng lọc tối ưu và không ảnh hưởng đến luồng không khí vào động cơ. Sử dụng lọc gió giả hoặc kém chất lượng có thể:</p>
      
      <ul>
        <li>Không lọc được hết bụi bẩn, gây hại cho động cơ</li>
        <li>Cản trở luồng không khí, làm giảm hiệu suất động cơ</li>
        <li>Có tuổi thọ ngắn hơn, phải thay thế thường xuyên</li>
        <li>Gây tốn nhiên liệu và tăng khí thải</li>
      </ul>
      
      <h3>Cách nhận biết lọc gió chính hãng</h3>
      
      <h4>1. Kiểm tra bao bì</h4>
      
      <p>Lọc gió chính hãng thường có bao bì với các đặc điểm sau:</p>
      
      <ul>
        <li>Logo và thương hiệu rõ ràng, sắc nét</li>
        <li>Mã sản phẩm và thông số kỹ thuật đầy đủ</li>
        <li>Tem chống hàng giả hoặc mã QR để kiểm tra</li>
        <li>Chất lượng in ấn cao, không mờ nhòe</li>
      </ul>
      
      <h4>2. Kiểm tra chất lượng sản phẩm</h4>
      
      <p>Lọc gió chính hãng có những đặc điểm nhận dạng:</p>
      
      <ul>
        <li>Khung nhựa chắc chắn, không có vết nứt hoặc méo mó</li>
        <li>Giấy lọc có màu sắc đồng đều (thường là trắng hoặc be)</li>
        <li>Nếp gấp giấy lọc đều đặn và chính xác</li>
        <li>Có gioăng cao su kín khít xung quanh</li>
        <li>Không có mùi lạ hoặc mùi nhựa rẻ tiền</li>
      </ul>
      
      <h4>3. Kiểm tra nguồn gốc</h4>
      
      <ul>
        <li>Mua từ các đại lý ủy quyền hoặc cửa hàng phụ tùng uy tín</li>
        <li>Có hóa đơn, chứng từ rõ ràng</li>
        <li>Giá cả phù hợp với thị trường (cảnh giác với giá quá rẻ)</li>
      </ul>
      
      <h3>Một số thương hiệu lọc gió uy tín</h3>
      
      <p>Các thương hiệu lọc gió nổi tiếng và đáng tin cậy trên thị trường:</p>
      
      <ul>
        <li>Toyota Genuine Parts</li>
        <li>Honda Genuine Parts</li>
        <li>Denso</li>
        <li>Bosch</li>
        <li>Mann-Filter</li>
        <li>K&N</li>
      </ul>
      
      <p>Việc sử dụng lọc gió chính hãng tuy có chi phí cao hơn ban đầu, nhưng sẽ giúp bạn tiết kiệm chi phí về lâu dài nhờ hiệu suất động cơ tốt hơn và giảm nguy cơ hỏng hóc.</p>
    `
  },
  {
    id: 3,
    title: "5 dấu hiệu cho thấy lọc gió ô tô cần được thay thế",
    slug: "5-dau-hieu-cho-thay-loc-gio-o-to-can-duoc-thay-the",
    excerpt: "Lọc gió bẩn có thể gây ra nhiều vấn đề cho xe. Hãy tìm hiểu những dấu hiệu để biết khi nào cần thay lọc gió mới cho xe của bạn.",
    image: "/loc-gio-dieu-hoa.jpg",
    date: "05/08/2023",
    category: "Bảo dưỡng",
    author: "Kỹ sư Thành",
    content: `
      <p>Lọc gió là một bộ phận quan trọng trong hệ thống nạp khí của động cơ. Nó có nhiệm vụ lọc sạch không khí trước khi đi vào buồng đốt, giúp động cơ hoạt động hiệu quả và kéo dài tuổi thọ. Tuy nhiên, không phải ai cũng biết khi nào cần thay lọc gió mới.</p>
      
      <p>Dưới đây là 5 dấu hiệu rõ ràng cho thấy lọc gió ô tô của bạn cần được thay thế:</p>
      
      <h3>1. Giảm hiệu suất động cơ</h3>
      
      <p>Khi lọc gió bị tắc nghẽn, lượng không khí đi vào động cơ sẽ bị giảm, dẫn đến:</p>
      
      <ul>
        <li>Xe chậm chạp khi tăng tốc</li>
        <li>Công suất động cơ giảm đáng kể</li>
        <li>Cảm giác xe "không có sức" khi lái</li>
      </ul>
      
      <p>Nếu bạn nhận thấy xe không còn mạnh mẽ như trước, đó có thể là dấu hiệu của lọc gió bẩn.</p>
      
      <h3>2. Tăng mức tiêu thụ nhiên liệu</h3>
      
      <p>Khi lọc gió bị bẩn, động cơ sẽ phải làm việc vất vả hơn để đạt được cùng một hiệu suất. Điều này dẫn đến việc tiêu thụ nhiên liệu tăng lên. Nếu bạn nhận thấy xe đi được quãng đường ngắn hơn với cùng một lượng nhiên liệu, hãy kiểm tra lọc gió.</p>
      
      <h3>3. Động cơ phát ra tiếng ồn bất thường</h3>
      
      <p>Lọc gió bẩn có thể khiến động cơ hoạt động không đều và phát ra tiếng ồn bất thường. Nếu bạn nghe thấy:</p>
      
      <ul>
        <li>Tiếng rít khi tăng ga</li>
        <li>Động cơ nổ không đều khi chạy không tải</li>
        <li>Tiếng ồn lạ từ khoang động cơ</li>
      </ul>
      
      <p>Đây có thể là dấu hiệu của việc lọc gió cần được thay thế.</p>
      
      <h3>4. Đèn kiểm tra động cơ (Check Engine) bật sáng</h3>
      
      <p>Hệ thống quản lý động cơ hiện đại có thể phát hiện khi hỗn hợp không khí-nhiên liệu không đúng tỷ lệ do lọc gió bẩn. Điều này có thể kích hoạt đèn kiểm tra động cơ. Nếu đèn này bật sáng, một trong những thứ cần kiểm tra đầu tiên là lọc gió.</p>
      
      <h3>5. Kiểm tra trực quan lọc gió</h3>
      
      <p>Cách đơn giản nhất để biết lọc gió có cần thay hay không là kiểm tra trực quan:</p>
      
      <ul>
        <li>Lọc gió mới có màu trắng hoặc be sáng</li>
        <li>Lọc gió cần thay thường có màu xám, đen hoặc đầy bụi bẩn</li>
        <li>Nếu bạn không thể nhìn thấy ánh sáng xuyên qua khi giơ lọc gió lên nguồn sáng, đã đến lúc thay mới</li>
      </ul>
      
      <h3>Khi nào nên thay lọc gió?</h3>
      
      <p>Theo khuyến cáo chung, lọc gió nên được thay thế sau mỗi:</p>
      
      <ul>
        <li>15.000 - 30.000 km đối với điều kiện đường đô thị thông thường</li>
        <li>10.000 - 15.000 km đối với điều kiện đường nhiều bụi bẩn</li>
        <li>Hoặc 12 tháng, tùy điều kiện nào đến trước</li>
      </ul>
      
      <p>Việc thay lọc gió đúng thời điểm không chỉ giúp động cơ hoạt động hiệu quả mà còn tiết kiệm chi phí nhiên liệu và bảo dưỡng về lâu dài.</p>
    `
  },
  {
    id: 4,
    title: "So sánh lọc gió động cơ và lọc gió điều hòa: Sự khác biệt và tầm quan trọng",
    slug: "so-sanh-loc-gio-dong-co-va-loc-gio-dieu-hoa",
    excerpt: "Hiểu rõ sự khác nhau giữa lọc gió động cơ và lọc gió điều hòa giúp bạn bảo dưỡng xe đúng cách và đảm bảo sức khỏe cho người ngồi trong xe.",
    image: "/loc-gio-dieu-hoa.jpg",
    date: "18/08/2023",
    category: "Kiến thức",
    author: "Chuyên gia Hùng",
    content: ""
  },
  {
    id: 5,
    title: "Hướng dẫn tự thay lọc gió động cơ tại nhà",
    slug: "huong-dan-tu-thay-loc-gio-dong-co-tai-nha",
    excerpt: "Thay lọc gió động cơ là một thao tác đơn giản mà bạn có thể tự làm tại nhà. Bài viết này sẽ hướng dẫn bạn từng bước một cách chi tiết.",
    image: "/loc-gio-dieu-hoa.jpg",
    date: "29/08/2023",
    category: "Hướng dẫn",
    author: "Kỹ thuật viên Minh",
    content: ""
  },
  {
    id: 6,
    title: "Lọc gió ô tô: Loại nào phù hợp với xe của bạn?",
    slug: "loc-gio-o-to-loai-nao-phu-hop-voi-xe-cua-ban",
    excerpt: "Trên thị trường có nhiều loại lọc gió khác nhau. Bài viết này sẽ giúp bạn chọn đúng loại lọc gió phù hợp với nhu cầu và điều kiện sử dụng xe.",
    image: "/loc-gio-dieu-hoa.jpg",
    date: "10/09/2023",
    category: "Tư vấn",
    author: "Kỹ sư Thành",
    content: ""
  }
];

// Categories for filter
const categories = ["Tất cả", "Bảo dưỡng", "Kiến thức", "Hướng dẫn", "Tư vấn"];

export default function BlogPage() {
  return (
    <>
      <div className="bg-white">
        {/* Page Header */}
        <div className="bg-secondary-100 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">Blog</h1>
            <div className="flex items-center text-sm text-secondary-600">
              <Link href="/" className="hover:text-primary-600">Trang chủ</Link>
              <span className="mx-2">/</span>
              <span>Blog</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm ${
                  category === "Tất cả"
                    ? "bg-primary-500 text-white"
                    : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-all">
                <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/9] bg-secondary-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </Link>
                <div className="p-6">
                  <div className="flex items-center text-xs text-secondary-500 mb-2">
                    <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded mr-2">
                      {post.category}
                    </span>
                    <span>{post.date}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-bold text-lg text-secondary-900 mb-2 hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-secondary-200 flex items-center justify-center text-secondary-700 font-medium mr-2">
                        {post.author.charAt(0)}
                      </div>
                      <span className="text-xs text-secondary-700">{post.author}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                      Đọc tiếp
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 