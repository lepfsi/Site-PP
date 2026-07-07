import type { MouseEvent } from "react";

export function scrollToHome(): void {
  window.scrollTo({ top: 0, behavior: "smooth" });
  window.history.replaceState(null, "", "/");
}

export function navigateHomePath(pathname: string, event: MouseEvent<HTMLAnchorElement>): void {
  if (pathname !== "/") return;
  event.preventDefault();
  scrollToHome();
}

export function navigateHashPath(
  pathname: string,
  href: string,
  event: MouseEvent<HTMLAnchorElement>
): void {
  if (pathname !== "/" || !href.startsWith("/#")) return;

  const id = href.slice(2);

  if (!id) {
    event.preventDefault();
    scrollToHome();
    return;
  }

  const target = document.getElementById(id);
  if (!target) return;

  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", href);
}