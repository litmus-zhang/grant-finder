// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, Dataset } from 'crawlee';

// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
    // Use the requestHandler to process each of the crawled pages.
    async requestHandler({ request, page, enqueueLinks, log }) {
        console.log(`Processing ${request.url}...`);
        // click on the ecosystem label


        if (request.loadedUrl === 'https://blockworks.co/grants/programs') {
            await page.waitForSelector('button:has-text("Select ecosystem to filter")');
            await page.click('button:has-text("Select ecosystem to filter")')
            await page.click('text=Solana')


            await enqueueLinks({
                selector: 'tbody > tr > td > a.text-gray-900',
                label: 'Card Detail',
                strategy: 'all'
            })

        } else if (request.label === 'Card Detail') {
            await page.waitForLoadState('networkidle');
            let link, title;

            if (request.url.includes('notion.site')) {
                await page.waitForLoadState('networkidle');

                link = request.url;
                title = await page.title();

            } else {

                link = request.url;
                title = await page.title();
            }

            const result = {
                link,
                title,
            }
            log.info(`result: ${result}`);
            await Dataset.pushData(result);

            // await Dataset.exportToJSON('OUTPUT', { toKVS: 'my-data' })
        } else {
            await page.waitForSelector('.notion-collection-card')
            await page.click
            // Add all links found on the page to the queue.
            await enqueueLinks({
                selector: '.notion-collection-card > a',
                label: 'Card Detail'
            });
        }

        //  Superteam scraping logic
        // if (request.label === 'Card Detail') {
        //     const link = request.url;
        //     const title = await page.title();

        //     const result = {
        //         link,
        //         title,
        //     }
        //     // console.log(result);
        //     await Dataset.pushData(result);

        //     await Dataset.exportToJSON('OUTPUT', { toKVS: 'my-data' })
        // }
        // else {
        //     await page.waitForSelector('.notion-collection-card')
        //     await page.waitForSelector('.notion-collection-card__title')
        //     // Add all links found on the page to the queue.
        //     await enqueueLinks({
        //         selector: '.notion-colle',
        //         label: 'Card Detail'
        //     });
        // }

    },
    headless: false,


});

// Add first URL to the queue and start the crawl.
await crawler.run(['https://superteam.fun/instagrants', 'https://blockworks.co/grants/programs']);
//await crawler.run(['https://superteam.fun/instagrants']);
