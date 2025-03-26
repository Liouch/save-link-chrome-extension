export async function getCurrentTab() {
  let [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  return tab;
}
