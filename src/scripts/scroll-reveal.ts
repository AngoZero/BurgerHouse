// Global scroll-reveal, parallax, and scroll progress utilities.

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initReveal(): void {
  const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (els.length === 0) return;

  if (prefersReducedMotion) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const delay = parseInt(el.dataset.revealDelay ?? "0", 10);
        if (delay > 0) el.style.transitionDelay = `${delay}ms`;
        el.classList.add("is-visible");
        observer.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  els.forEach((el) => observer.observe(el));
}

function initParallax(): void {
  if (prefersReducedMotion) return;
  const parallaxEls = document.querySelectorAll<HTMLElement>("[data-parallax]");
  if (parallaxEls.length === 0) return;

  let rafId: number | null = null;

  const update = (): void => {
    const scrollY = window.scrollY;
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax || "0.2");
      const rect = el.parentElement?.getBoundingClientRect();
      if (!rect) return;
      // Only apply when the parent is roughly in view
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      const offset = scrollY * speed;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
    rafId = null;
  };

  const onScroll = (): void => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
}

function initScrollProgress(): void {
  if (prefersReducedMotion) return;
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;

  let rafId: number | null = null;

  const update = (): void => {
    const doc = document.documentElement;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (window.scrollY / height) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    rafId = null;
  };

  const onScroll = (): void => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
}

function init(): void {
  initReveal();
  initParallax();
  initScrollProgress();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
