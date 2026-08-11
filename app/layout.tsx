import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
export const metadata: Metadata = {
  title: { default: "O Nosso Enxoval", template: "%s · O Nosso Enxoval" },
  description:
    "Organiza as compras e a lista de desejos para a tua nova casa.",
  applicationName: "O Nosso Enxoval",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "O Nosso Enxoval",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#8A9A8B",
  colorScheme: "light",
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-PT" className={geist.variable}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
