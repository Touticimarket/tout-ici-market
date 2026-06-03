import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "TOUT ICI Market", description: "Tout acheter, tout vendre, tout trouver." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body>{children}</body></html>;
}
