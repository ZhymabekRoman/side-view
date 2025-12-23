/* globals buildSettings */

function element(selector) {
  return document.querySelector(selector);
}

function applyDarkTheme() {
  document.querySelector(".page").classList.add("dark-theme");
}

async function checkForDark() {
  browser.management.getAll().then((extensions) => {
    for (let extension of extensions) {
      // The user has the default dark theme enabled
      if (extension.id ===
        "firefox-compact-dark@mozilla.org@personas.mozilla.org"
        && extension.enabled) {
        applyDarkTheme();
      }
    }
  });
}

async function loadSettings() {
  const result = await browser.storage.local.get(["homeUrl"]);
  const homeUrlInput = element("#home-url");

  if (result.homeUrl) {
    homeUrlInput.value = result.homeUrl;
  }
}

async function saveSettings(event) {
  event.preventDefault();

  const homeUrlInput = element("#home-url");
  const homeUrl = homeUrlInput.value.trim();

  // Validate URL if provided
  if (homeUrl) {
    try {
      new URL(homeUrl);
    } catch (e) {
      showStatus("Please enter a valid URL", "error");
      return;
    }
  }

  await browser.storage.local.set({ homeUrl });
  showStatus("Settings saved successfully!", "success");
}

async function resetSettings() {
  element("#home-url").value = "";
  await browser.storage.local.remove("homeUrl");
  showStatus("Settings reset to default", "success");
}

function showStatus(message, type) {
  const statusElement = element("#status-message");
  statusElement.textContent = message;
  statusElement.className = `status-message status-${type}`;
  statusElement.style.display = "block";

  setTimeout(() => {
    statusElement.style.display = "none";
  }, 3000);
}

async function init() {
  await loadSettings();

  element("#settings-form").addEventListener("submit", saveSettings);
  element("#reset-button").addEventListener("click", resetSettings);

  checkForDark();
  browser.management.onEnabled.addListener(() => {
    checkForDark();
  });
}

init();
