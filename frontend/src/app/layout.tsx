import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "냐옹스 - 고양이 커뮤니티",
  description: "고양이를 사랑하는 사람들의 커뮤니티",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-orange-50/40 min-h-screen">
        <AuthProvider>
          <Header />
          <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
