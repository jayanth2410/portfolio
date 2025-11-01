/* ==== THEME TOGGLE ==== */
const themeBtn = document.getElementById("themeToggle");
const body = document.body;

themeBtn.addEventListener("click", () => {
  const newTheme =
    body.getAttribute("data-theme") === "dark" ? "light" : "dark";
  body.setAttribute("data-theme", newTheme);
  themeBtn.innerHTML =
    newTheme === "dark"
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  localStorage.setItem("theme", newTheme);
});
const saved = localStorage.getItem("theme") || "light";
body.setAttribute("data-theme", saved);
themeBtn.innerHTML =
  saved === "dark"
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';

/* ==== MOBILE MENU ==== */
const hamburger = document.getElementById("hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  hamburger.classList.toggle("active");
});

/* ==== ACTIVE NAV LINK ON SCROLL ==== */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((sec) => {
    const top = sec.offsetTop - 100;
    const height = sec.offsetHeight;
    if (pageYOffset >= top && pageYOffset < top + height)
      current = sec.getAttribute("id");
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").slice(1) === current)
      link.classList.add("active");
  });
});

/* ==== CLOSE MOBILE MENU ON LINK CLICK ==== */
navLinks.forEach((l) =>
  l.addEventListener("click", () => {
    navMenu.classList.remove("active");
    hamburger.classList.remove("active");
  })
);

/* ==== MAILTO FALLBACK (robust) ==== */
function showToast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  Object.assign(t.style, {
    position: "fixed",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(17,24,39,0.95)",
    color: "#fff",
    padding: "0.6rem 1rem",
    borderRadius: "8px",
    boxShadow: "0 6px 18px rgba(2,6,23,0.35)",
    zIndex: 9999,
    fontSize: "0.95rem",
  });
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transition = "opacity 300ms";
  }, 2400);
  setTimeout(() => t.remove(), 3000);
}

document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
  link.addEventListener("click", async (e) => {
    // try to open mail client; if blocked, fallback to copying email
    e.preventDefault();
    const href = link.getAttribute("href");
    const email = href.replace(/^mailto:/i, "");

    let opened = false;
    try {
      // Best-effort: try location change first (works in many browsers)
      window.location.href = href;
      opened = true;
    } catch (err) {
      // ignore
    }

    try {
      // Also try window.open (may be blocked) — wrapped in try
      const win = window.open(href);
      if (win) opened = true;
    } catch (err) {
      // ignore
    }

    // After a small delay, if still not opened, copy to clipboard and notify user
    setTimeout(async () => {
      try {
        await navigator.clipboard.writeText(email);
        showToast("Email copied to clipboard — paste into your mail client");
      } catch (err) {
        // If clipboard write fails, show the email so user can copy manually
        showToast("Could not open mail client. Email: " + email);
      }
    }, 500);
  });
});
