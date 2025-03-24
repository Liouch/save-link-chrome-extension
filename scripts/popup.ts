const root = document.getElementById('root');
const favIconFallback = '/images/icon.png';

async function getCurrentTab() {
  let [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  return tab;
}

async function renderCurrentTabBookmark() {
  const bookmarkElement = document.getElementById('bookmark-element-info');
  const bookmarkElementAction = document.getElementById(
    'bookmark-element-action'
  );
  const bookmarkFavIconElement = document.createElement('img');
  const bookmarkTitleSpan = document.createElement('span');
  const bookmarkActionButon = document.createElement('button');

  const tab = await getCurrentTab();

  // Set the favicon of the current tab
  bookmarkFavIconElement.src = tab.favIconUrl ?? favIconFallback;
  bookmarkFavIconElement.width = 16;
  bookmarkFavIconElement.height = 16;

  // Set the title of the current tab
  bookmarkTitleSpan.textContent = tab.title ?? null;

  // Set the action button of the current tab
  bookmarkActionButon.textContent = 'Add';

  bookmarkActionButon.onclick = () => {
    console.log(tab);
  };

  if (bookmarkElement) {
    bookmarkElement.appendChild(bookmarkFavIconElement);
    bookmarkElement.appendChild(bookmarkTitleSpan);
    bookmarkElement.appendChild(bookmarkActionButon);
  }
  if (bookmarkElementAction) {
    bookmarkElementAction.appendChild(bookmarkActionButon);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await renderCurrentTabBookmark();
});
