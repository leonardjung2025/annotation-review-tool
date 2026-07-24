const tabs = [...document.querySelectorAll(".journey-tab")];
const panels = [...document.querySelectorAll(".journey-panel")];
const nav = document.querySelector(".journey-nav");

let scrollAnimation = null;

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function getScrollY() {
  return window.scrollY || document.documentElement.scrollTop || 0;
}

function getNavHeight() {
  if (!nav) return 0;
  const height = nav.offsetHeight;
  document.documentElement.style.setProperty("--journey-nav-height", `${height}px`);
  return height;
}

function getTargetY(panel) {
  return panel.getBoundingClientRect().top + getScrollY() - getNavHeight();
}

function setActiveTab(journeyId) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.journey === journeyId;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

function scrollToY(targetY) {
  window.scrollTo(0, targetY);
  document.documentElement.scrollTop = targetY;
  document.body.scrollTop = targetY;
}

function scrollToJourney(journeyId, { animate = true, updateHash = true } = {}) {
  const panel = document.getElementById(journeyId);
  if (!panel) return;

  setActiveTab(journeyId);

  const targetY = getTargetY(panel);
  const startY = getScrollY();
  const distance = targetY - startY;

  if (!animate || Math.abs(distance) < 2) {
    scrollToY(targetY);
    if (updateHash) history.replaceState(null, "", `#${journeyId}`);
    return;
  }

  if (scrollAnimation) cancelAnimationFrame(scrollAnimation);

  const duration = Math.min(1200, Math.max(650, Math.abs(distance) * 0.55));
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    scrollToY(startY + distance * easeOutCubic(progress));

    if (progress < 1) {
      scrollAnimation = requestAnimationFrame(step);
    } else {
      scrollAnimation = null;
      if (updateHash) history.replaceState(null, "", `#${journeyId}`);
    }
  }

  // Kick off synchronously so mobile browsers keep the user-gesture scroll unlock.
  step(performance.now());
}

function getVisibleJourney() {
  const anchorY = getNavHeight() + 24;
  let current = panels[0]?.id;

  panels.forEach((panel) => {
    if (panel.getBoundingClientRect().top <= anchorY) current = panel.id;
  });

  return current;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", (event) => {
    event.preventDefault();
    scrollToJourney(tab.dataset.journey);
  });
});

window.addEventListener(
  "scroll",
  () => {
    if (scrollAnimation) return;
    setActiveTab(getVisibleJourney());
  },
  { passive: true }
);

window.addEventListener("resize", getNavHeight);

getNavHeight();

const initialJourney = location.hash.replace("#", "");
if (panels.some((panel) => panel.id === initialJourney)) {
  requestAnimationFrame(() => {
    scrollToJourney(initialJourney, { animate: false });
  });
} else {
  setActiveTab(panels[0]?.id ?? "journey-1");
}

window.addEventListener("hashchange", () => {
  const journeyId = location.hash.replace("#", "");
  if (panels.some((panel) => panel.id === journeyId)) {
    scrollToJourney(journeyId, { animate: true, updateHash: false });
  }
});
