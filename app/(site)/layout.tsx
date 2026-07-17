import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { Aurora } from "@/components/ui/aurora";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Aurora />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
