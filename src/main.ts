// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, Dataset } from 'crawlee';

// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
    // Use the requestHandler to process each of the crawled pages.
    async requestHandler({ request, page, enqueueLinks, log }) {
        console.log(`Processing ${request.url}...`);


        if (request.label === 'Card Detail') {
            const link = request.url;
            const title = await page.title();

            const result = {
                link,
                title,
            }
            // console.log(result);
            await Dataset.pushData(result);

            await Dataset.exportToJSON('OUTPUT', { toKVS: 'my-data' })
        }
        else {
            await page.waitForSelector('.notion-collection-card')
            await page.click
            // Add all links found on the page to the queue.
            await enqueueLinks({
                selector: '.notion-collection-card > a',
                label: 'Card Detail'
            });
        }

    }

});

// Add first URL to the queue and start the crawl.
await crawler.run(['https://superteam.fun/instagrants']);
