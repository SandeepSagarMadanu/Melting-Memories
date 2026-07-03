import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Melting Memories | Luxury Handcrafted Personalized Candles",
  description: "Transform your precious memories into handcrafted luxury candles. Custom-made personalized gifts, corporate decor and bespoke fragrance collections in Hyderabad, India.",
  keywords: ["luxury candles", "handcrafted candles", "personalized gifts", "melting memories", "scented candles Hyderabad", "custom candle corporate gifting"],
  authors: [{ name: "Melting Memories" }],
  metadataBase: new URL("https://melting-memories.vercel.app"),
  openGraph: {
    title: "Melting Memories | Luxury Handcrafted Personalized Candles",
    description: "Transform your precious memories into handcrafted luxury candles. Custom-made personalized gifts and bespoke collections.",
    url: "https://melting-memories.vercel.app",
    siteName: "Melting Memories",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Melting Memories Luxury Candles",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Melting Memories | Luxury Handcrafted Personalized Candles",
    description: "Luxury handcrafted personalized candles designed to celebrate love, milestones, and unforgettable moments.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
        />
        {/* Schema.org Organization Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "Melting Memories",
              "image": "https://melting-memories.vercel.app/og-image.jpg",
              "description": "Luxury Handcrafted Personalized Candles based in Hyderabad, India.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Hayathnagar",
                "addressLocality": "Hyderabad",
                "addressRegion": "Telangana",
                "postalCode": "500070",
                "addressCountry": "IN"
              },
              "telephone": "+919441251145",
              "url": "https://melting-memories.vercel.app",
              "founders": [
                {
                  "@type": "Person",
                  "name": "Delifa Anjum"
                },
                {
                  "@type": "Person",
                  "name": "Pasala Tharun"
                },
                {
                  "@type": "Person",
                  "name": "Madanu Sandeep Sagar"
                }
              ]
            })
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-ivory text-charcoal">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
