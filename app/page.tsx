import type { Metadata } from "next";
import Hero from "@/app/ui/landing/hero";

export const metadata: Metadata = {
  title: "Welcome",
};

export default function Home() {
  return <Hero />;
}
