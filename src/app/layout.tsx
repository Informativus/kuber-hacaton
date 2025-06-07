import "./globals.css";
import TopNavbar from "@/components/ui/TopNavbar";
import { Providers } from "./providers";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") || "";
  console.log(pathname);

  const hideNavbarRoutes = ["/auth"];
  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <html lang="ru">
      <body className="bg-background text-foreground antialiased">
        <Providers>
          {!shouldHideNavbar && <TopNavbar />}
          {children}
        </Providers>
      </body>
    </html>
  );
}
