import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Neural Booster | Augmentez vos capacités cognitives",
  description: "Neural Booster - L'application qui vous aide à développer votre créativité et améliorer vos capacités cognitives avec des jeux stimulants.",
  keywords: "neurosciences, cerveau, intelligence, mémoire, concentration, développement cognitif, app, application mobile",
  authors: [{ name: "NeuralBooster Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className={`${roboto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
