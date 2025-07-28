import type { Metadata } from "next";
import { Roboto, Playfair_Display } from "next/font/google";
import "./globals.css";
import AnnouncementModal from "./components/AnnouncementModal";
import NavbarFooterWrapper from "./components/NavbarFooterWrapper";

const roboto = Roboto({
  weight : ['400','700'],
  subsets : ['latin'],
  variable: '--font-roboto',
  display:'swap'
})

const playfairDisplay = Playfair_Display({
  weight: ['400', '700'], // Regular and Bold
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Keystone - Investment & Travel',
  description: 'Your trusted partner for managing wealth and moving journeys.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${playfairDisplay.variable}`}>
        {/* Announcement Modal */}
        <AnnouncementModal/>
        {/* Wrap children with Navbar/Footer wrapper */}
        <NavbarFooterWrapper>
          <main className="flex-1 pt-16">
            {children}
          </main>
        </NavbarFooterWrapper>
      </body>
    </html>
  );
}
