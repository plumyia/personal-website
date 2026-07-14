import Link from "next/link";
import { ScrollToTop } from "./scroll-to-top";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-10 sm:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-[13px] font-medium tracking-wide text-text-secondary transition-colors hover:text-accent"
          >
            徐羽佳
          </Link>
          <span className="text-[12px] text-text-tertiary">
            &copy; {new Date().getFullYear()}
          </span>
        </div>

        <ScrollToTop />
      </div>
    </footer>
  );
}
