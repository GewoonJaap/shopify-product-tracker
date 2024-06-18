import { NotificationMessageType } from './types/notification/notificationMessageType';
import { NTFYPriorityType } from './types/notification/ntfyPriorityType';
import { NotificationPrioritySettingsConfig, ShopifyStoreConfig } from './types/shopify/shopifyStoreConfig';

export const NTFY = {
	URGENT_PRIORITY: { name: 'urgent', rank: 5 } as NTFYPriorityType,
	HIGH_PRIORITY: { name: 'high', rank: 4 } as NTFYPriorityType,
	DEFAULT_PRIORITY: { name: 'default', rank: 3 } as NTFYPriorityType,
	LOW_PRIORITY: { name: 'low', rank: 2 } as NTFYPriorityType,
	MIN_PRIORITY: { name: 'min', rank: 1 } as NTFYPriorityType,
};

export const SHOPIFY_STORES = {
	STORES: [
		{
			URL: 'https://qwe-312-uk.myshopify.com',
			FRIENDLY_NAME: 'Taylor Swift - UK Store',
			ENABLED: true,
			NOTIFICATION_PRIORITY_SETTINGS: {
				VERY_IMPORTANT: [],
				VERY_IMPORTANT_TYPE: NTFY.URGENT_PRIORITY,
			},
			DEFAULT_ICON: 'https://shopify-tracker.ams3.cdn.digitaloceanspaces.com/taylor-swift/taylor-swift.jpg',
		},
		{
			URL: 'https://ts-merchandise-m.myshopify.com',
			FRIENDLY_NAME: 'Taylor Swift - US Store',
			ENABLED: true,
			NOTIFICATION_PRIORITY_SETTINGS: {
				VERY_IMPORTANT: [],
				VERY_IMPORTANT_TYPE: NTFY.URGENT_PRIORITY,
			},
			DEFAULT_ICON: 'https://shopify-tracker.ams3.cdn.digitaloceanspaces.com/taylor-swift/taylor-swift.jpg',
		},
	] as ShopifyStoreConfig[],
	GLOBAL_NOTIFICATION_PRIORITY_SETTINGS: {
		VERY_IMPORTANT: ['signed', 'limited edition', 'exclusive', 'vinyl'],
		VERY_IMPORTANT_TYPE: NTFY.URGENT_PRIORITY,
	} as NotificationPrioritySettingsConfig,
	PRODUCTS_URL: '/products.json',
	COLLECTIONS_URL: '/collections.json',
};

export const NOTIFICATION_MESSAGES = {
	PRODUCT_AVAILABLE_IN_STORE: {
		MESSAGE: '{{PRODUCT_TITLE}}, is now available in the {{STORE_NAME}}.',
		PRIORITY: NTFY.HIGH_PRIORITY,
	} as NotificationMessageType,
	PRODUCT_AVAILABLE_IN_STORE_FIRST_TIME: {
		MESSAGE: '{{PRODUCT_TITLE}}, is now available in the {{STORE_NAME}} for the first time.',
		PRIORITY: NTFY.URGENT_PRIORITY,
	} as NotificationMessageType,
	PRODUCT_UNAVAILABLE_IN_STORE: {
		MESSAGE: '{{PRODUCT_TITLE}}, is no longer available in the {{STORE_NAME}}.',
		PRIORITY: NTFY.LOW_PRIORITY,
	} as NotificationMessageType,
};
