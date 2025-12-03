const playwright = require('playwright');

async function check(width, height) {
  const browser = await playwright.chromium.launch({args:['--no-sandbox']});
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const url = 'http://localhost:3000/waitlist';
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const result = await page.evaluate(() => {
      const onlyMobile = document.querySelector('.only-mobile');
      const onlyDesktop = document.querySelector('.only-desktop');
      const leftPhone = document.querySelector('.only-mobile img') || document.querySelector('.only-desktop img');
      return {
        onlyMobileDisplay: onlyMobile ? window.getComputedStyle(onlyMobile).display : null,
        onlyDesktopDisplay: onlyDesktop ? window.getComputedStyle(onlyDesktop).display : null,
        leftPhonePresent: !!leftPhone,
        // sample innerHTML small portion to prove presence
        innerHTMLSample: onlyMobile ? onlyMobile.innerHTML.slice(0,120) : null
      };
    });
    console.log(`Viewport ${width}x${height}:`, JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error checking', err);
  } finally {
    await browser.close();
  }
}

(async () => {
  await check(1200, 800);
  await check(375, 812);
})();
