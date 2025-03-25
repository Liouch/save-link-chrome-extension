var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getCurrentTab, getPersistedDatabaseURL, getPersistedAPIKey, handleAddBookmark, getBookmarks, getPersistedBookmarks, setPersistedBookmarks, handleRemoveBookmark, } from './utils.js';
const favIconFallback = '/images/icon.png';
function renderCurrentTabBookmark() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const bookmarkElement = document.getElementById('bookmark-element-info');
        const bookmarkElementAction = document.getElementById('bookmark-element-action');
        const bookmarkFavIconElement = document.createElement('img');
        const bookmarkTitleSpan = document.createElement('span');
        const bookmarkActionButon = document.createElement('button');
        const tab = yield getCurrentTab();
        // Set the favicon of the current tab
        bookmarkFavIconElement.src = (_a = tab === null || tab === void 0 ? void 0 : tab.favIconUrl) !== null && _a !== void 0 ? _a : favIconFallback;
        bookmarkFavIconElement.width = 16;
        bookmarkFavIconElement.height = 16;
        // Set the title of the current tab
        bookmarkTitleSpan.textContent = (_b = tab === null || tab === void 0 ? void 0 : tab.title) !== null && _b !== void 0 ? _b : null;
        console.log(tab);
        // Check if url is already bookmarked
        const bookmarks = yield getPersistedBookmarks();
        const isBookmarked = bookmarks.record.bookmarks.some((bookmark) => bookmark.url === (tab === null || tab === void 0 ? void 0 : tab.url));
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
    const databaseURLInput = document.createElement('input');
    const apiKeyInput = document.createElement('input');
    const submitButton = document.createElement('button');
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
    formElement.appendChild(databaseURLInput);
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
