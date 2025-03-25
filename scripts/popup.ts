const root = document.getElementById('root');
const favIconFallback = '/images/icon.png';

async function getBookmarks() {
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
  bookmarkFavIconElement.src = tab?.favIconUrl ?? favIconFallback;
  bookmarkFavIconElement.width = 16;
  bookmarkFavIconElement.height = 16;

  // Set the title of the current tab
  bookmarkTitleSpan.textContent = tab?.title ?? null;

  // Set the action button of the current tab
  bookmarkActionButon.textContent = 'Add';

  bookmarkActionButon.onclick = async () => {
    await handleAddBookmark(tab);
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

async function handleSubmit({ databaseURL, apiKey }) {
  await chrome.storage.local.set({ url: databaseURL, apiKey });
  window.location.reload();
}

function renderConfigForm(
  { databaseURL, apiKey } = { databaseURL: '', apiKey: '' }
) {
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

  document.getElementById('config-container')?.appendChild(formElement);
}

function renderSettingsSection(
  { databaseURL, apiKey } = { databaseURL: '', apiKey: '' }
) {
  const settingsButton = document.createElement('button');
  settingsButton.id = 'config-toggle-button';
  let settingsButtonText = 'View Settings';

  settingsButton.textContent = settingsButtonText;
  settingsButton.onclick = () => {
    const formElement = document.getElementById('config-form');
    if (formElement) {
      formElement.remove();
      settingsButtonText = 'View Settings';
    } else {
      renderConfigForm({ databaseURL, apiKey });
      settingsButtonText = 'Hide Settings';
    }
    settingsButton.textContent = settingsButtonText;
  };
  document.getElementById('config-container')?.appendChild(settingsButton);
}

function renderErrorMessage() {
  const bookmarkContainer = document.getElementById('bookmark-container');
  const erorContainer = document.createElement('div');
  const errorMessage = document.createElement('p');
  errorMessage.style.color = 'red';
  errorMessage.textContent = 'No database URL found';
  erorContainer.appendChild(errorMessage);
  bookmarkContainer?.appendChild(erorContainer);
}

document.addEventListener('DOMContentLoaded', async () => {
  const databaseURL = (await persistedDatabaseURL()) ?? '';
  const apiKey = (await persistedAPIKey()) ?? '';

  if (!Boolean(databaseURL)) {
    renderErrorMessage();
  } else {
    await renderCurrentTabBookmark();
  }
  renderSettingsSection({ databaseURL, apiKey });
});
