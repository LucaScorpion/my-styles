export function initTabs(tabs: HTMLElement, tabsContent: HTMLElement): void {
  // Activate the first tab.
  tabs.children[0].classList.add('active');
  tabsContent.children[0].classList.add('active');

  const clearActive = () => {
    for (const tab of tabs.children) {
      tab.classList.remove('active');
    }
    for (const child of tabsContent.children) {
      child.classList.remove('active');
    }
  };

  // Handle clicking the tabs.
  for (let i = 0; i < tabs.children.length; i++) {
    tabs.children[i].addEventListener('click', () => {
      clearActive();
      tabs.children[i].classList.add('active');
      tabsContent.children[i].classList.add('active');
    });
  }
}
