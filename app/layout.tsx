import type { Metadata } from "next";
import { Poppins, Cormorant_Infant, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { weddingData } from "@/data/wedding";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const cormorant = Cormorant_Infant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pinyon",
  display: "swap",
});

export const metadata: Metadata = {
  title: `Undangan Pernikahan — ${weddingData.couple.groom.nickname} & ${weddingData.couple.bride.nickname}`,
  description: `${weddingData.invitation.subTitle} ${weddingData.couple.groom.fullName} & ${weddingData.couple.bride.fullName}. ${weddingData.invitation.date}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${cormorant.variable} ${pinyon.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
