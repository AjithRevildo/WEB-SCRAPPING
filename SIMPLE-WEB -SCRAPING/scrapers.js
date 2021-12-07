const puppeteer = require('puppeteer');

async function scrapeProduct(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [el] = await page.$x('//*[@id="imgBlkFront"]');
    const src =await el.getProperty('src');
    const imgURL = await src.jsonValue();

    const [el2] = await page.$x('//*[@id="title"]');
    const txt =await el2.getProperty('textContent');
    const title = await txt.jsonValue();

    const [el3] = await page.$x('//*[@id="a-autoid-8-announce"]');
    const txt2 =await el3.getProperty('textContent');
    const price = await txt2.jsonValue();

    console.log({imgURL,title,price});
    browser.close();
}
scrapeProduct('https://www.amazon.com/Black-Swan-Improbable-Robustness_Fragility/dp/081297381X/ref=sr_1_2');

