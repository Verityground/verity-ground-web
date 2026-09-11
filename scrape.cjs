const puppeteer = require('puppeteer');

(async () => {
    console.log('Membuka browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    console.log('Mengakses website...');
    await page.goto('https://verity-ground.web.app/', {
        waitUntil: 'networkidle2',
    });

    // Mengambil seluruh teks hasil render JavaScript
    const textContent = await page.evaluate(() => document.body.innerText);

    console.log('\n--- KONTEN WEBSITE ---\n');
    console.log(textContent);
    console.log('\n----------------------\n');

    await browser.close();
})();