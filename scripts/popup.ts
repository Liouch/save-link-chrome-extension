async function getCurrentTabUrl() {
  let [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  return tab?.url ?? 'No URL found';
}

document.addEventListener('DOMContentLoaded', async () => {
  const tabUrl = document.createElement('p');
  document.body.appendChild(tabUrl);

  tabUrl.textContent = await getCurrentTabUrl();
});
