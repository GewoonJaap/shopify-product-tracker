import { NTFYPriorityType } from '../notification/ntfyPriorityType';

export interface ShopifyStoreConfig {
	URL: string;
	FRIENDLY_NAME: string;
	ENABLED: boolean;
	NOTIFICATION_PRIORITY_SETTINGS: NotificationPrioritySettingsConfig;
	DEFAULT_ICON: string;
}

export interface NotificationPrioritySettingsConfig {
	VERY_IMPORTANT: string[];
	VERY_IMPORTANT_TYPE: NTFYPriorityType;
}
