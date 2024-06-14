export interface ShopifyStoreConfig {
	URL: string;
	FRIENDLY_NAME: string;
	ENABLED: boolean;
	NOTIFICATION_PRIORITY_SETTINGS: NotificationPrioritySettingsConfig;
}

export interface NotificationPrioritySettingsConfig {
	VERY_IMPORTANT: string[];
}
