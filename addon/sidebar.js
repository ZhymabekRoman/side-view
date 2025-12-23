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

async function checkForCustomHome() {
  const result = await browser.storage.local.get(["homeUrl"]);
  if (result.homeUrl) {
    // If a custom home URL is set, navigate to it
    window.location.href = result.homeUrl;
  }
}

async function init() {
  element("#watch-tutorial").onclick = () => {
    window.open("https://youtu.be/no6D_B4wgo8");
  };

  // Check if there's a custom home page configured
  await checkForCustomHome();

  checkForDark();
  browser.management.onEnabled.addListener((info) => {
    checkForDark();
  });
}

init();
