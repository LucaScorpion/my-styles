import { getSyncStorage } from './storage';

(() => {
  document.getElementById('log')!.addEventListener('click', async () => {
    console.log('CLICKED!');

    await browser.storage.sync.set({
      styles: [
        'https://gist.githubusercontent.com/LucaScorpion/6dd6a9b74e8326e420ed8d2a1f0a4635/raw/29151b4f58003e898642e5769b1e92502de64989/infi.nl.css',
      ],
    });
    console.log(await getSyncStorage());
  });
})();
