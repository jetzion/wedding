import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/** Wrapper for admin pages. Access is checked in each page and action, not here. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex flex-1 flex-col bg-shallows/40 px-4 py-12 sm:py-16">{children}</main>;
}
