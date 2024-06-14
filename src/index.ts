import { Hono } from 'hono';
import { Bindings } from './types/bindings';
import { ShopifyProductScraper } from './util/shopify/shopifyproductScraper';
import { SHOPIFY_STORES } from './const';

const app = new Hono<{ Bindings: Bindings }>();

app.onError((err, c) => {
	console.error(`${err}`);
	return c.text(err.toString());
});

app.notFound(c => c.text('Not found', 404));

(app as any).scheduled = async (event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) => {
		for(const store of SHOPIFY_STORES.STORES){
		await new ShopifyProductScraper(store.URL, env).scrapeProducts();
		}
};

export default app;
