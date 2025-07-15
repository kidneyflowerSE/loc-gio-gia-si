import { ReactNode } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "./Header";
import Footer from "./Footer";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const router = useRouter();

  const routeTitleMap: Record<string, string> = {
    "/": "Lọc gió ô tô chính hãng giá sỉ",
    "/products": "Sản phẩm | Lọc gió giá sỉ",
    "/blog": "Blog | Lọc gió giá sỉ",
    "/contact": "Liên hệ | Lọc gió giá sỉ",
    "/about": "Về chúng tôi | Lọc gió giá sỉ",
    "/cart": "Giỏ hàng | Lọc gió giá sỉ",
  };

  let title = "Lọc gió giá sỉ";
  for (const path in routeTitleMap) {
    if (router.pathname === path || router.pathname.startsWith(path + "/")) {
      title = routeTitleMap[path];
      break;
    }
  }

  return (
    <div className="flex flex-col justify-center w-full min-h-screen bg-white">
      <Head>
        <title>{title}</title>
      </Head>
      <Header />
      <main className="flex-1 w-full bg-white mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
} 