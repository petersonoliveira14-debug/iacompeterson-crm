import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "IA com Peterson — Método LEAP | Gestor de IA",
  description: "Torne-se um Gestor de IA com o Método LEAP. Aprenda a liderar, automatizar e escalar negócios com IA — sem programar uma linha de código.",
  openGraph: {
    title: "IA com Peterson — Método LEAP",
    description: "Do usuário de IA ao gestor que a comanda. Construa sistemas reais sem programar uma linha de código.",
    url: "https://iacompeterson.com.br",
    siteName: "IA com Peterson",
    images: [{ url: "/photos/peterson-headshot.jpg", width: 927, height: 1235, alt: "Peterson Oliveira — Criador do Método LEAP" }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IA com Peterson — Método LEAP",
    description: "Do usuário de IA ao gestor que a comanda.",
    images: ["/photos/peterson-headshot.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
