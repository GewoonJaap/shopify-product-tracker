import { Hono } from 'hono';
import { Bindings } from './types/bindings';
import { SHOPIFY_STORES } from './const';
import { ShopifyProductScraper } from './util/shopify/shopifyproductScraper';

const app = new Hono<{ Bindings: Bindings }>();

app.onError((err, c) => {
	console.error(`${err}`);
	return c.text(err.toString());
});

app.notFound(c => c.text('Not found', 404));

(app as any).scheduled = async (event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) => {
	if (!env.WORKER_DOMAIN) {
		for (const store of SHOPIFY_STORES.STORES) {
			if (!store.ENABLED) continue;
			await new ShopifyProductScraper(store, env).scrapeProducts();
		}
		return;
	}

	const fetchPromises = SHOPIFY_STORES.STORES.filter(store => store.ENABLED).map(store => {
		const url = `https://${env.WORKER_DOMAIN}/scrape/${store.ID}`;
		return fetch(url, { method: 'GET' });
	});

	await Promise.all(fetchPromises);
};

// HTTP endpoint to trigger scraping for a specific store
app.get('/scrape/:storeId', async c => {
	const storeId = c.req.param('storeId');
	const store = SHOPIFY_STORES.STORES.find(s => s.ID === storeId);

	if (!store) {
		return c.text('Store not found', 404);
	}

	if (!store.ENABLED) {
		return c.text('Store is not enabled', 400);
	}

	const env = c.env as Bindings;
	await new ShopifyProductScraper(store, env).scrapeProducts();
	return c.text('Scraping started for store: ' + storeId);
});

export default app;
