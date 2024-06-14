import { Bindings } from "../types/bindings";
import { ShopifyStoreConfig } from "../types/shopify/shopifyStoreConfig";
import { ProductDB } from "./interface/ProductDb";
import { productUrlHelper } from "./shopify/shopifyHelpers";

export async function sendToNtfy(product: ProductDB, store: ShopifyStoreConfig, env: Bindings) {
	const bodyObject = {
		topic: env.NTFY_TOPIC,
		message: `Product ${product.title} is now available in the ${store.FRIENDLY_NAME} store.`,
		actions: [
			{
				action: 'view',
				label: 'View Product',
				url: productUrlHelper(store.URL, product.handle),
			},
		],
	};
	await fetch(env.NTFY_URL, {
		method: 'POST', // PUT works too
		body: JSON.stringify(bodyObject),
		headers: {
			Title: `Product ${product.title} is now available in the ${store.FRIENDLY_NAME} store.`,
			Priority: 'urgent',
			Tags: 'warning',
			Authorization: 'Bearer ' + env.NTFY_BEARER,
		},
	});
}
