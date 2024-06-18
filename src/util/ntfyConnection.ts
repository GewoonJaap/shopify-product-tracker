import { NOTIFICATION_MESSAGES, NTFY, SHOPIFY_STORES } from '../const';
import { Bindings } from '../types/bindings';
import { NotificationMessageType } from '../types/notification/notificationMessageType';
import { Product, Variant } from '../types/shopify/shopifyProduct';
import { ShopifyStoreConfig } from '../types/shopify/shopifyStoreConfig';
import { ExtendedProductDb } from './interface/ExtendedProductDb';
import { productCartUrlHelper, productUrlHelper } from './shopify/shopifyHelpers';
import { renderTemplateString } from './stringHelper/stringTemplateRenderer';

/**
 * @param {ExtendedProductDb} product - The product to send a notification for
 * @param {ShopifyStoreConfig} store - The store to send a notification for
 * @param {Bindings} env - The environment variables
 * @param {boolean} firstTimeSeen - Whether the product is being seen for the first time
 * @returns {Promise<void>} - Returns a promise
 */
export async function sendToNtfy(
	product: ExtendedProductDb,
	store: ShopifyStoreConfig,
	env: Bindings,
	firstTimeSeen: boolean = false,
	shopifyProduct: Product,
	shopifyVariant: Variant
): Promise<void> {
	const notificationMessage = getTemplateString(product, firstTimeSeen);
	const bodyObject = {
		topic: env.NTFY_TOPIC,
		message: renderTemplateString(notificationMessage.MESSAGE, {
			PRODUCT_TITLE: product.title,
			STORE_NAME: store.FRIENDLY_NAME,
		}),
		actions: [
			{
				action: 'view',
				label: 'View Product',
				url: productUrlHelper(store.URL, product.handle),
			},
			{
				action: 'view',
				label: 'Add to cart',
				url: productCartUrlHelper(store.URL, shopifyVariant.id),
			},
		],
	};
	await fetch(env.NTFY_URL, {
		method: 'POST', // PUT works too
		body: JSON.stringify(bodyObject),
		headers: {
			Title: renderTemplateString(notificationMessage.MESSAGE, {
				PRODUCT_TITLE: product.title,
				STORE_NAME: store.FRIENDLY_NAME,
			}),
			Icon: getIcon(shopifyProduct, store),
			Attach: getIcon(shopifyProduct, store),
			Priority: getPriorityForProductNotification(product, store, notificationMessage),
			Tags: 'warning',
			Authorization: 'Bearer ' + env.NTFY_BEARER,
		},
	});
}

function getIcon(shopifyProduct: Product, store: ShopifyStoreConfig): string {
	return shopifyProduct.images[0]?.src ?? store.DEFAULT_ICON;
}

/**
 * @param {ExtendedProductDb} product - The product to send a notification for
 * @param {boolean} firstTimeSeen - Whether the product is being seen for the first time
 * @returns {NotificationMessageType} Returns the notification message template
 */
function getTemplateString(product: ExtendedProductDb, firstTimeSeen: boolean): NotificationMessageType {
	if (product.available) {
		if (firstTimeSeen) {
			return NOTIFICATION_MESSAGES.PRODUCT_AVAILABLE_IN_STORE_FIRST_TIME;
		}
		return NOTIFICATION_MESSAGES.PRODUCT_AVAILABLE_IN_STORE;
	}
	return NOTIFICATION_MESSAGES.PRODUCT_UNAVAILABLE_IN_STORE;
}

/**
 * @param {ExtendedProductDb} product - The product to send a notification for
 * @param {ShopifyStoreConfig} store - The store to send a notification for
 * @param {NotificationMessageType} notificationMessage - The notification message template
 * @returns {string} Returns the priority for the product notification
 */
export function getPriorityForProductNotification(
	product: ExtendedProductDb,
	store: ShopifyStoreConfig,
	notificationMessage: NotificationMessageType
): string {
	if (
		store.NOTIFICATION_PRIORITY_SETTINGS.VERY_IMPORTANT.some(word => product.title.toLowerCase().includes(word)) ||
		store.NOTIFICATION_PRIORITY_SETTINGS.VERY_IMPORTANT.some(word => product.bodyHtml.toLowerCase().includes(word))
	) {
		if (store.NOTIFICATION_PRIORITY_SETTINGS.VERY_IMPORTANT_TYPE.rank >= notificationMessage.PRIORITY.rank) {
			return store.NOTIFICATION_PRIORITY_SETTINGS.VERY_IMPORTANT_TYPE.name;
		}
	}
	if (
		SHOPIFY_STORES.GLOBAL_NOTIFICATION_PRIORITY_SETTINGS.VERY_IMPORTANT.some(word => product.title.toLowerCase().includes(word)) ||
		SHOPIFY_STORES.GLOBAL_NOTIFICATION_PRIORITY_SETTINGS.VERY_IMPORTANT.some(word => product.bodyHtml.toLowerCase().includes(word))
	) {
		if (SHOPIFY_STORES.GLOBAL_NOTIFICATION_PRIORITY_SETTINGS.VERY_IMPORTANT_TYPE.rank >= notificationMessage.PRIORITY.rank) {
			return SHOPIFY_STORES.GLOBAL_NOTIFICATION_PRIORITY_SETTINGS.VERY_IMPORTANT_TYPE.name;
		}
	}
	return notificationMessage.PRIORITY.name;
}
