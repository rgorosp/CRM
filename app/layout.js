import { Manrope } from "next/font/google";
import "./globals.css";

// Fonte única do projeto (ver design.md).
// Pesos: 400 texto, 600 rótulo, 700 seção, 800 título de página.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Meu CRM",
  description: "Sistema para organizar contatos e oportunidades de negócio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={manrope.className}>
      <body>{children}</body>
    </html>
  );
}
