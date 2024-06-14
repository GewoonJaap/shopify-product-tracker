import { Bindings } from "../types/bindings";
import { ProductDB } from "./interface/ProductDb";

export async function sendToNtfy(product: ProductDB, shopifyBaseUrl: string, env: Bindings) {
	const bodyObject = {
		topic: env.NTFY_TOPIC,
		message: `Product ${product.title} is now available in the ${product.shopifyStore} store.`,
		actions: [
			{
				action: 'view',
				label: 'View Product',
				url: shopifyBaseUrl + '/' + product.handle,
			},
		],
	};
	await fetch(env.NTFY_URL, {
		method: 'POST', // PUT works too
		body: JSON.stringify(bodyObject),
		headers: {
			Title: `Product ${product.title} is now available in the ${product.shopifyStore} store.`,
			Priority: 'urgent',
			Tags: 'warning',
			Authorization: 'Bearer ' + env.NTFY_BEARER,
		},
	});
}
