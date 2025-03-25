var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function getCurrentTab() {
    return __awaiter(this, void 0, void 0, function* () {
        let [tab] = yield chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });
        return tab;
    });
}
// Methods to persist and remove data in the local storage
export function getPersistedDatabaseURL() {
    return __awaiter(this, void 0, void 0, function* () {
        const { url } = yield chrome.storage.local.get(['url']);
        return url;
    });
}
export function getPersistedAPIKey() {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiKey } = yield chrome.storage.local.get(['apiKey']);
        return apiKey;
    });
}
export function getPersistedBookmarks() {
    return __awaiter(this, void 0, void 0, function* () {
        const { bookmarks } = yield chrome.storage.local.get(['bookmarks']);
        return bookmarks;
    });
}
export function removePersistedDatabaseURL() {
    return __awaiter(this, void 0, void 0, function* () {
        yield chrome.storage.local.remove(['databaseURL']);
    });
}
export function removePersistedApiKey() {
    return __awaiter(this, void 0, void 0, function* () {
        yield chrome.storage.local.remove(['apiKey']);
    });
}
export function removePersistedBookmars() {
    return __awaiter(this, void 0, void 0, function* () {
        yield chrome.storage.local.remove(['bookmarks']);
    });
}
export function removePersistedStorage() {
    return __awaiter(this, void 0, void 0, function* () {
        yield chrome.storage.local.clear();
    });
}
export function setPersistedDatabaseURL(databaseURL) {
    return __awaiter(this, void 0, void 0, function* () {
        yield chrome.storage.local.set({ url: databaseURL });
    });
}
export function setPersistedApiKey(apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        yield chrome.storage.local.set({ apiKey });
    });
}
export function setPersistedBookmarks(bookmarks) {
    return __awaiter(this, void 0, void 0, function* () {
        yield chrome.storage.local.set({ bookmarks });
    });
}
// Method to fetch bookmarks from the API
export function getBookmarks() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('https://api.jsonbin.io/v3/b/67e14d988561e97a50f1d9b1', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Key': '$2a$10$0kgq1M4B.h1J1LX6EUzhjOBRT.6tkG1CvIWBiEmHhPNhuWNRSrhum', // TODO: Use chrome storage to store the key
            },
        });
        if (!response.ok) {
            const error = yield response.json();
            throw new Error(response.status + error.message);
        }
        const data = yield response.json();
        return data;
    });
}
// Methods to add and remove bookmarks
export function handleAddBookmark(tab) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = yield getPersistedDatabaseURL();
        const apiKey = yield getPersistedAPIKey();
        const bookmarks = yield getPersistedBookmarks();
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
        const response = yield fetch(yield getPersistedDatabaseURL(), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Key': yield getPersistedAPIKey(),
            },
            body,
        });
        if (!response.ok) {
            const error = yield response.json();
            throw new Error(response.status + error.message);
        }
        const data = yield response.json();
        yield setPersistedBookmarks(data);
        window.location.reload();
    });
}
export function handleRemoveBookmark(tab) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = yield getPersistedDatabaseURL();
        const apiKey = yield getPersistedAPIKey();
        const bookmarks = yield getPersistedBookmarks();
        const filteredBookmarks = bookmarks.record.bookmarks.filter((bookmark) => bookmark.url !== tab.url);
        const body = JSON.stringify({
            bookmarks: filteredBookmarks,
        });
        const response = yield fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Key': apiKey,
            },
            body,
        });
        if (!response.ok) {
            const error = yield response.json();
            throw new Error(response.status + error.message);
        }
        const data = yield response.json();
        yield setPersistedBookmarks(data);
        window.location.reload();
    });
}
