import { NTFY, SHOPIFY_STORES } from '../const';
import { Bindings } from '../types/bindings';
import { ShopifyStoreConfig } from '../types/shopify/shopifyStoreConfig';
import { ExtendedProductDb } from './interface/ExtendedProductDb';
import { productUrlHelper } from './shopify/shopifyHelpers';

export async function sendToNtfy(product: ExtendedProductDb, store: ShopifyStoreConfig, env: Bindings) {
	const bodyObject = {
		topic: env.NTFY_TOPIC,
		message: `${product.title}, is now available in the ${store.FRIENDLY_NAME}.`,
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
			Title: `${product.title}, is now available in the ${store.FRIENDLY_NAME}.`,
			Priority: getPriorityForProductNotification(product, store),
			Tags: 'warning',
			Authorization: 'Bearer ' + env.NTFY_BEARER,
		},
	});
}

export function getPriorityForProductNotification(product: ExtendedProductDb, store: ShopifyStoreConfig) {
	if (
		store.NOTIFICATION_PRIORITY_SETTINGS.VERY_IMPORTANT.some(word => product.title.toLowerCase().includes(word)) ||
		store.NOTIFICATION_PRIORITY_SETTINGS.VERY_IMPORTANT.some(word => product.bodyHtml.toLowerCase().includes(word))
	) {
		return NTFY.URGENT_PRIORITY;
	}
	if (
		SHOPIFY_STORES.GLOBAL_NOTIFICATION_PRIORITY_SETTINGS.VERY_IMPORTANT.some(word => product.title.toLowerCase().includes(word)) ||
		SHOPIFY_STORES.GLOBAL_NOTIFICATION_PRIORITY_SETTINGS.VERY_IMPORTANT.some(word => product.bodyHtml.toLowerCase().includes(word))
	) {
		return NTFY.URGENT_PRIORITY;
	}
	return NTFY.NORMAL_PRIORITY;
}
