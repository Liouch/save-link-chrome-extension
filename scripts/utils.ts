export async function getCurrentTab() {
  let [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  return tab;
}

// Methods to persist and remove data in the local storage
export async function getPersistedDatabaseURL() {
  const { url } = await chrome.storage.local.get(['url']);
  return url;
}

export async function getPersistedAPIKey() {
  const { apiKey } = await chrome.storage.local.get(['apiKey']);
  return apiKey;
}

export async function getPersistedBookmarks() {
  const { bookmarks } = await chrome.storage.local.get(['bookmarks']);
  return bookmarks;
}

export async function removePersistedDatabaseURL() {
  await chrome.storage.local.remove(['databaseURL']);
}

export async function removePersistedApiKey() {
  await chrome.storage.local.remove(['apiKey']);
}

export async function removePersistedBookmars() {
  await chrome.storage.local.remove(['bookmarks']);
}

export async function removePersistedStorage() {
  await chrome.storage.local.clear();
}

export async function setPersistedDatabaseURL(databaseURL: string) {
  await chrome.storage.local.set({ url: databaseURL });
}

export async function setPersistedApiKey(apiKey: string) {
  await chrome.storage.local.set({ apiKey });
}

export async function setPersistedBookmarks(bookmarks: any) {
  await chrome.storage.local.set({ bookmarks });
}
