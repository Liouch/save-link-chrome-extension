var save_link_chrome_extension = (function (exports) {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    // Methods to persist and remove data in the local storage
    function getPersistedDatabaseURL() {
        return __awaiter(this, void 0, void 0, function* () {
            const { url } = yield chrome.storage.local.get(['url']);
            return url;
        });
    }
    function getPersistedAPIKey() {
        return __awaiter(this, void 0, void 0, function* () {
            const { apiKey } = yield chrome.storage.local.get(['apiKey']);
            return apiKey;
        });
    }
    function getPersistedBookmarks() {
        return __awaiter(this, void 0, void 0, function* () {
            const { bookmarks } = yield chrome.storage.local.get(['bookmarks']);
            return bookmarks;
        });
    }
    function removePersistedDatabaseURL() {
        return __awaiter(this, void 0, void 0, function* () {
            yield chrome.storage.local.remove(['databaseURL']);
        });
    }
    function removePersistedApiKey() {
        return __awaiter(this, void 0, void 0, function* () {
            yield chrome.storage.local.remove(['apiKey']);
        });
    }
    function removePersistedBookmars() {
        return __awaiter(this, void 0, void 0, function* () {
            yield chrome.storage.local.remove(['bookmarks']);
        });
    }
    function removePersistedStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield chrome.storage.local.clear();
        });
    }
    function setPersistedDatabaseURL(databaseURL) {
        return __awaiter(this, void 0, void 0, function* () {
            yield chrome.storage.local.set({ url: databaseURL });
        });
    }
    function setPersistedApiKey(apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            yield chrome.storage.local.set({ apiKey });
        });
    }
    function setPersistedBookmarks(bookmarkResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            yield chrome.storage.local.set({ bookmarks: bookmarkResponse });
        });
    }

    // Method to fetch bookmarks from the API
    function getBookmarks() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const url = (_a = (yield getPersistedDatabaseURL())) !== null && _a !== void 0 ? _a : '';
            const apiKey = (_b = (yield getPersistedAPIKey())) !== null && _b !== void 0 ? _b : '';
            const response = yield fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Access-Key': apiKey,
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
    function handleAddBookmark(tab) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const url = (_a = (yield getPersistedDatabaseURL())) !== null && _a !== void 0 ? _a : '';
            const apiKey = (_b = (yield getPersistedAPIKey())) !== null && _b !== void 0 ? _b : '';
            const bookmarks = yield getPersistedBookmarks();
            const newBookmark = {
                id: ((_c = bookmarks === null || bookmarks === void 0 ? void 0 : bookmarks.record.bookmarks.length) !== null && _c !== void 0 ? _c : 0) + 1,
                title: tab.title,
                url: tab.url,
                tags: [],
                createdAt: new Date().toISOString(),
            };
            const body = JSON.stringify({
                bookmarks: [...((_d = bookmarks === null || bookmarks === void 0 ? void 0 : bookmarks.record.bookmarks) !== null && _d !== void 0 ? _d : []), newBookmark],
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
    function handleRemoveBookmark(tab) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const url = (_a = (yield getPersistedDatabaseURL())) !== null && _a !== void 0 ? _a : '';
            const apiKey = (_b = (yield getPersistedAPIKey())) !== null && _b !== void 0 ? _b : '';
            const bookmarks = yield getPersistedBookmarks();
            const filteredBookmarks = bookmarks === null || bookmarks === void 0 ? void 0 : bookmarks.record.bookmarks.filter((bookmark) => bookmark.url !== tab.url);
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

    function getCurrentTab() {
        return __awaiter(this, void 0, void 0, function* () {
            let [tab] = yield chrome.tabs.query({
                active: true,
                lastFocusedWindow: true,
            });
            return tab;
        });
    }

    const favIconFallback = '/images/icon48.png';
    function renderCurrentTabBookmark() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const bookmarkElement = document.getElementById('bookmark-element-info');
            const bookmarkElementAction = document.getElementById('bookmark-element-action');
            const bookmarkFavIconElement = document.createElement('img');
            const bookmarkTitleSpan = document.createElement('span');
            const bookmarkActionButon = document.createElement('button');
            const tab = yield getCurrentTab();
            // Set the favicon of the current tab
            bookmarkFavIconElement.src = (tab === null || tab === void 0 ? void 0 : tab.favIconUrl)
                ? tab.favIconUrl
                : favIconFallback;
            bookmarkFavIconElement.width = 16;
            bookmarkFavIconElement.height = 16;
            // Set the title of the current tab
            bookmarkTitleSpan.textContent = (_a = tab === null || tab === void 0 ? void 0 : tab.title) !== null && _a !== void 0 ? _a : null;
            // Check if url is already bookmarked
            const bookmarks = yield getPersistedBookmarks();
            const isBookmarked = bookmarks === null || bookmarks === void 0 ? void 0 : bookmarks.record.bookmarks.some((bookmark) => bookmark.url === (tab === null || tab === void 0 ? void 0 : tab.url));
            // Set the action button of the current tab
            bookmarkActionButon.textContent = isBookmarked ? 'Remove' : 'Add';
            bookmarkActionButon.onclick = () => __awaiter(this, void 0, void 0, function* () {
                bookmarkActionButon.textContent = 'Adding...';
                if (isBookmarked) {
                    yield handleRemoveBookmark(tab);
                }
                else {
                    yield handleAddBookmark(tab);
                }
            });
            if (bookmarkElement) {
                bookmarkElement.appendChild(bookmarkFavIconElement);
                bookmarkElement.appendChild(bookmarkTitleSpan);
                bookmarkElement.appendChild(bookmarkActionButon);
            }
            if (bookmarkElementAction) {
                bookmarkElementAction.appendChild(bookmarkActionButon);
            }
        });
    }
    function handleSubmit(_a) {
        return __awaiter(this, arguments, void 0, function* ({ databaseURL, apiKey, }) {
            yield chrome.storage.local.set({ url: databaseURL, apiKey });
            window.location.reload();
        });
    }
    function renderConfigForm({ databaseURL, apiKey } = {
        databaseURL: '',
        apiKey: '',
    }) {
        var _a;
        const formElement = document.createElement('form');
        formElement.id = 'config-form';
        formElement.className = 'config-form';
        const databaseURLlabel = document.createElement('label');
        const apiKeyLabel = document.createElement('label');
        const databaseURLInput = document.createElement('input');
        const apiKeyInput = document.createElement('input');
        const submitButton = document.createElement('button');
        databaseURLlabel.textContent = 'Database URL';
        apiKeyLabel.textContent = 'API Key';
        databaseURLlabel.htmlFor = 'database-url-input';
        apiKeyLabel.htmlFor = 'api-key-input';
        databaseURLInput.id = 'database-url-input';
        databaseURLInput.name = 'database-url-input';
        databaseURLInput.placeholder = 'Database URL';
        databaseURLInput.value = databaseURL;
        apiKeyInput.id = 'api-key-input';
        apiKeyInput.name = 'api-key-input';
        apiKeyInput.placeholder = 'API Key';
        apiKeyInput.value = apiKey;
        submitButton.textContent = 'Save';
        submitButton.type = 'submit';
        formElement.onsubmit = (evt) => {
            evt.preventDefault();
            handleSubmit({
                databaseURL: databaseURLInput.value,
                apiKey: apiKeyInput.value,
            });
        };
        formElement.appendChild(databaseURLlabel);
        formElement.appendChild(databaseURLInput);
        formElement.appendChild(apiKeyLabel);
        formElement.appendChild(apiKeyInput);
        formElement.appendChild(submitButton);
        (_a = document.getElementById('config-container')) === null || _a === void 0 ? void 0 : _a.appendChild(formElement);
    }
    function renderSettingsSection({ databaseURL, apiKey } = { databaseURL: '', apiKey: '' }) {
        var _a;
        const settingsButton = document.createElement('button');
        settingsButton.id = 'config-toggle-button';
        let settingsButtonText = 'View Settings';
        settingsButton.textContent = settingsButtonText;
        settingsButton.onclick = () => {
            const formElement = document.getElementById('config-form');
            if (formElement) {
                formElement.remove();
                settingsButtonText = 'View Settings';
            }
            else {
                renderConfigForm({ databaseURL, apiKey });
                settingsButtonText = 'Hide Settings';
            }
            settingsButton.textContent = settingsButtonText;
        };
        (_a = document.getElementById('config-container')) === null || _a === void 0 ? void 0 : _a.appendChild(settingsButton);
    }
    function renderErrorMessage() {
        const bookmarkContainer = document.getElementById('bookmark-container');
        const erorContainer = document.createElement('div');
        const errorMessage = document.createElement('p');
        errorMessage.style.color = 'red';
        errorMessage.textContent = 'No database URL found';
        erorContainer.appendChild(errorMessage);
        bookmarkContainer === null || bookmarkContainer === void 0 ? void 0 : bookmarkContainer.appendChild(erorContainer);
    }
    document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const databaseURL = (_a = (yield getPersistedDatabaseURL())) !== null && _a !== void 0 ? _a : '';
        const apiKey = (_b = (yield getPersistedAPIKey())) !== null && _b !== void 0 ? _b : '';
        const bookmarks = yield getPersistedBookmarks();
        if (!Boolean(databaseURL)) {
            renderErrorMessage();
        }
        else {
            if (!bookmarks) {
                const bookmarks = yield getBookmarks();
                setPersistedBookmarks(bookmarks);
            }
            yield renderCurrentTabBookmark();
        }
        renderSettingsSection({ databaseURL, apiKey });
    }));

    exports.getBookmarks = getBookmarks;
    exports.getCurrentTab = getCurrentTab;
    exports.getPersistedAPIKey = getPersistedAPIKey;
    exports.getPersistedBookmarks = getPersistedBookmarks;
    exports.getPersistedDatabaseURL = getPersistedDatabaseURL;
    exports.handleAddBookmark = handleAddBookmark;
    exports.handleRemoveBookmark = handleRemoveBookmark;
    exports.removePersistedApiKey = removePersistedApiKey;
    exports.removePersistedBookmars = removePersistedBookmars;
    exports.removePersistedDatabaseURL = removePersistedDatabaseURL;
    exports.removePersistedStorage = removePersistedStorage;
    exports.setPersistedApiKey = setPersistedApiKey;
    exports.setPersistedBookmarks = setPersistedBookmarks;
    exports.setPersistedDatabaseURL = setPersistedDatabaseURL;

    return exports;

})({});
