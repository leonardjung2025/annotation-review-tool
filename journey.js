const tabs = [...document.querySelectorAll(".journey-tab")];
const panels = [...document.querySelectorAll(".journey-panel")];

function showJourney(journeyId) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.journey === journeyId;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-current", isActive ? "page" : "false");
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.journey === journeyId;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });

  history.replaceState(null, "", `#${journeyId}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => showJourney(tab.dataset.journey));
});

const initialJourney = location.hash.replace("#", "");
if (panels.some((panel) => panel.id === initialJourney)) {
  showJourney(initialJourney);
}
