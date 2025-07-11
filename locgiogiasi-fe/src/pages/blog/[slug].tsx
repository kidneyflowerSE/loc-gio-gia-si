import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";

// Blog posts data (duplicated from listing page for now)
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
      
      <p>Lọc gió chính hãng được thiết kế đặc biệt phù hợp với từng loại động cơ, đảm bảo khả năng lọc tối ưu và không ảnh hưởng đến luồng không khí vào động cơ.</p>
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
      <p>Lọc gió là một bộ phận quan trọng trong hệ thống nạp khí của động cơ. Nó có nhiệm vụ lọc sạch không khí trước khi đi vào buồng đốt, giúp động cơ hoạt động hiệu quả và kéo dài tuổi thọ.</p>
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

export default function BlogDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  // Wait until the query param is available
  if (!slug) {
    return null;
  }

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (

        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Bài viết không tồn tại</h1>
          <Link href="/blog" className="text-primary-600 hover:underline">
            Quay lại Blog
          </Link>
        </div>
   
    );
  }

  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <>
      <Head>
        <title>{post.title} | Blog</title>
        <meta name="description" content={post.excerpt} />
      </Head>

      {/* Hero Image */}
      <div className="relative w-full aspect-[16/9] bg-secondary-100">
        <Image src={post.image} alt={post.title} fill className="object-cover" />
      </div>

      {/* Article Container */}
      <article className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Meta */}
          <div className="flex items-center text-xs text-secondary-500 mb-4">
            <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded mr-2">
              {post.category}
            </span>
            <span>{post.date}</span>
            <span className="mx-2">•</span>
            <span>{post.author}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-secondary-900 mb-6">
            {post.title}
          </h1>

          {/* Content */}
          <div
            className="space-y-4 leading-7 text-secondary-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-secondary-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-secondary-900 mb-8">
              Bài viết liên quan
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((rp) => (
                <div
                  key={rp.id}
                  className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-all"
                >
                  <Link
                    href={`/blog/${rp.slug}`}
                    className="block relative aspect-[16/9] bg-secondary-100"
                  >
                    <Image
                      src={rp.image}
                      alt={rp.title}
                      fill
                      className="object-cover"
                    />
                  </Link>
                  <div className="p-6">
                    <div className="flex items-center text-xs text-secondary-500 mb-2">
                      <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded mr-2">
                        {rp.category}
                      </span>
                      <span>{rp.date}</span>
                    </div>
                    <Link href={`/blog/${rp.slug}`}>
                      <h3 className="font-bold text-lg text-secondary-900 mb-2 hover:text-primary-600 transition-colors">
                        {rp.title}
                      </h3>
                    </Link>
                    <p className="text-secondary-600 text-sm line-clamp-3">
                      {rp.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
} 