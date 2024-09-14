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
			ID: 'taylor-swift-uk',
			URL: 'https://qwe-312-uk.myshopify.com',
			FRIENDLY_NAME: 'Taylor Swift - UK Store',
			ENABLED: true,
			NOTIFICATION_PRIORITY_SETTINGS: {
				VERY_IMPORTANT: [],
				VERY_IMPORTANT_TYPE: NTFY.URGENT_PRIORITY,
			},
			DEFAULT_ICON: 'https://shopify-tracker.ams3.cdn.digitaloceanspaces.com/taylor-swift/taylor-swift.jpg',
			NTFY_TOPIC: 'taylor-swift-uk',
			NTFY_ANNOUNCE_TO_GLOBAL_TOPIC: true,
		},
		{
			ID: 'taylor-swift-us',
			URL: 'https://ts-merchandise-m.myshopify.com',
			FRIENDLY_NAME: 'Taylor Swift - US Store',
			ENABLED: true,
			NOTIFICATION_PRIORITY_SETTINGS: {
				VERY_IMPORTANT: [],
				VERY_IMPORTANT_TYPE: NTFY.URGENT_PRIORITY,
			},
			DEFAULT_ICON: 'https://shopify-tracker.ams3.cdn.digitaloceanspaces.com/taylor-swift/taylor-swift.jpg',
			NTFY_TOPIC: 'taylor-swift-us',
			NTFY_ANNOUNCE_TO_GLOBAL_TOPIC: true,
		},
		{
			ID: 'taylor-swift-de',
			URL: 'https://de-taylor-swift-prod.myshopify.com',
			FRIENDLY_NAME: 'Taylor Swift - EU Store',
			ENABLED: true,
			NOTIFICATION_PRIORITY_SETTINGS: {
				VERY_IMPORTANT: [],
				VERY_IMPORTANT_TYPE: NTFY.URGENT_PRIORITY,
			},
			DEFAULT_ICON: 'https://shopify-tracker.ams3.cdn.digitaloceanspaces.com/taylor-swift/taylor-swift.jpg',
			NTFY_TOPIC: 'taylor-swift-de',
			NTFY_ANNOUNCE_TO_GLOBAL_TOPIC: true,
		},
		{
			ID: 'sabrina-carpenter-us',
			URL: 'https://sabrina-carpenter-official.myshopify.com',
			FRIENDLY_NAME: 'Sabrina Carpenter - US Store',
			ENABLED: false,
			NOTIFICATION_PRIORITY_SETTINGS: {
				VERY_IMPORTANT: [],
				VERY_IMPORTANT_TYPE: NTFY.URGENT_PRIORITY,
			},
			DEFAULT_ICON: 'https://shopify-tracker.ams3.cdn.digitaloceanspaces.com/sabrina-carpenter/sabrina-carpenter.jpg',
			NTFY_TOPIC: 'sabrina-carpenter-us',
			NTFY_ANNOUNCE_TO_GLOBAL_TOPIC: true,
		},
		{
			ID: 'blood-records',
			URL: 'https://blood-records.myshopify.com',
			FRIENDLY_NAME: 'Blood Records - Store',
			ENABLED: false,
			NOTIFICATION_PRIORITY_SETTINGS: {
				VERY_IMPORTANT: [],
				VERY_IMPORTANT_TYPE: NTFY.URGENT_PRIORITY,
			},
			DEFAULT_ICON: 'https://shopify-tracker.ams3.cdn.digitaloceanspaces.com/sabrina-carpenter/sabrina-carpenter.jpg',
			NTFY_TOPIC: 'blood-records',
			NTFY_ANNOUNCE_TO_GLOBAL_TOPIC: true,
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
		PRIORITY: NTFY.MIN_PRIORITY,
	} as NotificationMessageType,
	PRODUCT_AVAILABLE_IN_STORE_FIRST_TIME: {
		MESSAGE: '{{PRODUCT_TITLE}}, is now available in the {{STORE_NAME}} for the first time.',
		PRIORITY: NTFY.MIN_PRIORITY,
	} as NotificationMessageType,
	PRODUCT_UNAVAILABLE_IN_STORE: {
		MESSAGE: '{{PRODUCT_TITLE}}, is no longer available in the {{STORE_NAME}}.',
		PRIORITY: NTFY.MIN_PRIORITY,
	} as NotificationMessageType,
};

export const NOTIFICATION_TAGS = {
	TAGS: [
		{
			NAME: 'signed',
			TEXT_TRIGGER: ['signed', 'signature'],
		},
		{
			NAME: 'limited edition',
			TEXT_TRIGGER: ['limited edition', 'limited', 'edition'],
		},
		{
			NAME: 'exclusive',
			TEXT_TRIGGER: ['exclusive'],
		},
		{
			NAME: 'vinyl',
			TEXT_TRIGGER: ['vinyl'],
		},
		{
			NAME: 'cd',
			TEXT_TRIGGER: ['cd'],
		},
		{
			NAME: 'shirt',
			TEXT_TRIGGER: ['shirt', 't-shirt', 'tee', 'hoodie', 'sweatshirt', 'sweater', 'jumper'],
		},
		{
			NAME: 'pen',
			TEXT_TRIGGER: ['pen', 'writing', 'stationary', 'signed', 'signature'],
		},
	],
};
