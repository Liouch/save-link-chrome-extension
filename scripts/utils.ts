export async function getCurrentTab() {
  let [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  return tab;
}

export async function persistedDatabaseURL() {
  const { url } = await chrome.storage.local.get(['url']);
  return url;
}

export async function persistedAPIKey() {
  const { apiKey } = await chrome.storage.local.get(['apiKey']);
  return apiKey;
}

export async function removePersistedDatabaseURL() {
  await chrome.storage.local.remove(['databaseURL']);
}

export async function removePersistedApiKey() {
  await chrome.storage.local.remove(['apiKey']);
}

export async function removePersistedStorage() {
  await chrome.storage.local.clear();
}
