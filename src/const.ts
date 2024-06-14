import { ShopifyStoreConfig } from './types/shopify/shopifyStoreConfig';

export const SHOPIFY_STORES = {
	STORES: [
		{
			URL: 'https://qwe-312-uk.myshopify.com',
			FRIENDLY_NAME: 'Taylor Swift - UK Store',
			ENABLED: true,
			NOTIFICATION_PRIORITY_SETTINGS: {
				VERY_IMPORTANT: [],
			},
		},
		{
			URL: 'https://ts-merchandise-m.myshopify.com',
			FRIENDLY_NAME: 'Taylor Swift - US Store',
			ENABLED: true,
			NOTIFICATION_PRIORITY_SETTINGS: {
				VERY_IMPORTANT: [],
			},
		},
	] as ShopifyStoreConfig[],
	GLOBAL_NOTIFICATION_PRIORITY_SETTINGS: {
		VERY_IMPORTANT: ['signed', 'limited edition', 'exclusive', 'vinyl'],
	},
	PRODUCTS_URL: '/products.json',
	COLLECTIONS_URL: '/collections.json',
};

export const NTFY = {
	NORMAL_PRIORITY: 'normal',
	URGENT_PRIORITY: 'urgent',
};
