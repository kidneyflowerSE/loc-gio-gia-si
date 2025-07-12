import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col justify-center w-full min-h-screen bg-white">
      <Header />
      <main className="flex-1 w-full bg-white mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
} 