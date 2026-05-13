import { Hero } from "@/components/landing/hero";
import { ValueProps } from "@/components/landing/value-props";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ValueProps />
      </main>
      <SiteFooter />
    </>
  );
}
