export function initTabs(tabs: HTMLElement, tabsContent: HTMLElement): void {
  // Activate the first tab.
  tabs.children[0].classList.add('active');
  tabsContent.children[0].classList.add('active');

  // Set the tabIndex to 0 for all tabs.
  for (const tab of tabs.children) {
    if (tab instanceof HTMLElement) {
      tab.tabIndex = 0;
    }
  }

  const clearActive = () => {
    for (const tab of tabs.children) {
      tab.classList.remove('active');
    }
    for (const child of tabsContent.children) {
      child.classList.remove('active');
    }
  };

  const activateTab = (i: number) => {
    clearActive();
    tabs.children[i].classList.add('active');
    tabsContent.children[i].classList.add('active');
  };

  // Handle clicking the tabs.
  for (let i = 0; i < tabs.children.length; i++) {
    const child = tabs.children[i];
    if (child instanceof HTMLElement) {
      child.addEventListener('click', () => activateTab(i));
      child.addEventListener('keydown', (e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
          activateTab(i);
        }
      });
    }
  }
}
