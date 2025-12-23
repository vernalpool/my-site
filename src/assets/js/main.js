// Main JS entry point
// Parallax and interactions will live here later

console.log("Site JS loaded");
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector('[data-collapsible]');

  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.getAttribute("data-open") === "true";
    links.setAttribute("data-open", String(!isOpen));
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // ----- Splash click-to-enter -----
  const isSplash = document.body.dataset.splash === "true";
  if (isSplash) {
    const destination = "/painting/";

    // Click anywhere except on actual links (like the Enter button)
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) return;
      window.location.href = destination;
    });

    // Keyboard: Enter/Space to enter
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.location.href = destination;
      }
    });
  }

  // ----- Parallax (very light) -----
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches; // phones/tablets often
  if (reduceMotion || coarsePointer) return;

  const parallaxRoot = document.querySelector("[data-parallax]");
  if (!parallaxRoot) return;

  const layers = [...parallaxRoot.querySelectorAll("[data-depth]")];
  if (!layers.length) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId = null;

  function animate() {
    // smooth follow
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    for (const layer of layers) {
      const depth = parseFloat(layer.dataset.depth || "0");
      const x = currentX * depth;
      const y = currentY * depth;
      layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    rafId = requestAnimationFrame(animate);
  }

  window.addEventListener("mousemove", (e) => {
    const { innerWidth: w, innerHeight: h } = window;
    const nx = (e.clientX - w / 2) / (w / 2);
    const ny = (e.clientY - h / 2) / (h / 2);
    targetX = nx * 30; // intensity
    targetY = ny * 30;

    if (!rafId) rafId = requestAnimationFrame(animate);
  });
});
