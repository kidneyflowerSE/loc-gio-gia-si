import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");

  const content = <Component {...pageProps} />;

  return isAdminRoute ? content : <Layout>{content}</Layout>;
}
