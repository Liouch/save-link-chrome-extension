import {
  getPersistedAPIKey,
  getPersistedBookmarks,
  getPersistedDatabaseURL,
  setPersistedBookmarks,
} from './storage';
import { Bookmark, BookmarkResponse } from './types';

// Method to fetch bookmarks from the API
export async function getBookmarks() {
  const url = (await getPersistedDatabaseURL()) ?? '';
  const apiKey = (await getPersistedAPIKey()) ?? '';
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Key': apiKey,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(response.status + error.message);
  }
  const data: BookmarkResponse = await response.json();
  return data;
}

// Methods to add and remove bookmarks
export async function handleAddBookmark(tab: chrome.tabs.Tab) {
  const url = (await getPersistedDatabaseURL()) ?? '';
  const apiKey = (await getPersistedAPIKey()) ?? '';
  const bookmarks = await getPersistedBookmarks();
  const newBookmark: Bookmark = {
    id: (bookmarks?.record.bookmarks.at(-1)?.id ?? 0) + 1,
    title: tab.title ?? '',
    url: tab.url ?? '',
    tags: [],
    createdAt: new Date().toISOString(),
    favIconURL: tab.favIconUrl ?? '',
  };

  const body = JSON.stringify({
    bookmarks: [...(bookmarks?.record.bookmarks ?? []), newBookmark],
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
  const url = (await getPersistedDatabaseURL()) ?? '';
  const apiKey = (await getPersistedAPIKey()) ?? '';
  const bookmarks = await getPersistedBookmarks();

  const filteredBookmarks = bookmarks?.record.bookmarks.filter(
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
  const data: BookmarkResponse = await response.json();
  await setPersistedBookmarks(data);
  window.location.reload();
}
