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
export function persistedDatabaseURL() {
    return __awaiter(this, void 0, void 0, function* () {
        const { url } = yield chrome.storage.local.get(['url']);
        return url;
    });
}
export function persistedAPIKey() {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiKey } = yield chrome.storage.local.get(['apiKey']);
        return apiKey;
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
export function removePersistedStorage() {
    return __awaiter(this, void 0, void 0, function* () {
        yield chrome.storage.local.clear();
    });
}
