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

// Method to fetch bookmarks from the API
export async function getBookmarks() {
  const response = await fetch(
    'https://api.jsonbin.io/v3/b/67e14d988561e97a50f1d9b1',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key':
          '$2a$10$0kgq1M4B.h1J1LX6EUzhjOBRT.6tkG1CvIWBiEmHhPNhuWNRSrhum', // TODO: Use chrome storage to store the key
      },
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(response.status + error.message);
  }
  const data = await response.json();
  return data;
}

// Methods to add and remove bookmarks
export async function handleAddBookmark(tab: chrome.tabs.Tab) {
  const url = await getPersistedDatabaseURL();
  const apiKey = await getPersistedAPIKey();
  const bookmarks = await getPersistedBookmarks();
  const newBookmark = {
    id: bookmarks.record.bookmarks.length + 1,
    title: tab.title,
    url: tab.url,
    tags: [],
    createdAt: new Date().toISOString(),
  };

  const body = JSON.stringify({
    bookmarks: [...bookmarks.record.bookmarks, newBookmark],
  });

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Key': apiKey,
    },
    body,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(response.status + error.message);
  }
  const data = await response.json();
  await setPersistedBookmarks(data);
  window.location.reload();
}

export async function handleRemoveBookmark(tab: chrome.tabs.Tab) {
  const url = await getPersistedDatabaseURL();
  const apiKey = await getPersistedAPIKey();
  const bookmarks = await getPersistedBookmarks();

  const filteredBookmarks = bookmarks.record.bookmarks.filter(
    (bookmark: { url: string }) => bookmark.url !== tab.url
  );

  const body = JSON.stringify({
    bookmarks: filteredBookmarks,
  });

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Key': apiKey,
    },
    body,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(response.status + error.message);
  }
  const data = await response.json();
  await setPersistedBookmarks(data);
  window.location.reload();
}
