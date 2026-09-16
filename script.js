(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches;

  /* ---- loader: wait for first paint, then reveal to hero split ---- */
  const loader = document.getElementById("loader");
  const heroLines = document.querySelectorAll("[data-split]");
  heroLines.forEach((el) => {
    el.innerHTML = [...el.textContent.trim()].map((ch) =>
      `<span class="l">${ch === " " ? "\u00A0" : ch}</span>`
    ).join("");
  });

  setTimeout(() => {
    loader.classList.add("done");
    document.body.classList.add("loaded");
    heroLines.forEach((el) => el.classList.add("current"));
  }, 2300);
  setTimeout(() => loader.remove(), 3400);

  /* ---- reveal on scroll ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.setProperty("--d", `${Math.min(i * 90, 540)}ms`);
        e.target.classList.add("inview");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

  /* ---- scroll progress ---- */
  const progress = document.getElementById("progress");
  addEventListener("scroll", () => {
    const h = document.documentElement;
    const pct = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progress.style.width = `${pct * 100}%`;
  });

  if (reduced || coarse) return;

  /* ---- custom cursor ---- */
  const dot = document.querySelector(".cursor");
  const ring = document.querySelector(".cursor-ring");
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

  addEventListener("mousemove", (ev) => {
    mx = ev.clientX; my = ev.clientY;
    dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  });

  (function loop() { // ring lerps behind the dot
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx - 21}px, ${ry - 21}px)`;
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll("a, .hero-line").forEach((el) => {
    el.addEventListener("mouseenter", () => dot.classList.add("hovering"));
    el.addEventListener("mouseleave", () => dot.classList.remove("hovering"));
  });

  /* ---- magnetic CTA ---- */
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (ev) => {
      const r = el.getBoundingClientRect();
      el.style.transform =
        `translate(${(ev.clientX - r.left - r.width / 2) * 0.25}px, ${(ev.clientY - r.top - r.height / 2) * 0.25}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });

  /* ---- project row hover -> floating preview follows cursor ---- */
  const preview = document.querySelector(".preview");
  const previews = [
    ["01 — FIFA WORLD CUP", "Interactive web experience around the World Cup concept."],
    ["02 — LOVEPIC", "College-oriented social & dating platform for students."],
    ["03 — ATHITHI", "Digital event & guest platform, purpose-built and deployed."],
    ["04 — JARVIS", "AI assistant: voice, memory, vision, automation, task management."],
  ];
  let cur = -1;

  document.querySelectorAll("[data-preview]").forEach((row) => {
    row.addEventListener("mouseenter", () => {
      cur = +row.dataset.preview;
      preview.dataset.p = cur;
      preview.innerHTML = `<span>${previews[cur][0]}</span><br>${previews[cur][1]}`;
      preview.classList.add("on");
    });
    row.addEventListener("mouseleave", () => { cur = -1; preview.classList.remove("on"); });
  });

  addEventListener("mousemove", (ev) => {
    if (cur !== -1) { preview.style.left = ev.clientX + "px"; preview.style.top = ev.clientY + "px"; }
  });
})();